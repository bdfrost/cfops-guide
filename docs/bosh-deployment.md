---
id: bosh-deployment
title: Deploying BOSH
---

This page walks you through deploying the BOSH director making use of the [environments directory structure](getting-started-environments.md).

> **Alternative:**
>
> You can also use [bosh-bootloader](https://github.com/cloudfoundry/bosh-bootloader) to stand up a BOSH director.
> bosh-bootloader adds some Terraform scripts to provision required infrastructure on public clouds.
> It even provisions infrastructure to be used by Cloud Foundry or a Concourse deployment.


## Setting up the Base

To deploy a BOSH director we will use the [bosh-deployment](https://github.com/cloudfoundry/bosh-deployment) BOSH release, which we will integrate as a Git submodule:

```bash
git submodule add \
    https://github.com/cloudfoundry/bosh-deployment.git \
    base/bosh/resources/bosh-deployment
git submodule update --init
```

This has a some great advantages: 

- We will always know which version of BOSH we have installed by looking at the Git repository.
- We can easily use and pin a specific version.
- Upgrading the BOSH director is a means of upgrading the bosh-deployment submodule to a newer version.


## The Deployment Script

Once we have the `bosh-deployment` repository in place we can start writing the deployment script for the BOSH director.
In order to deploy the BOSH director, we start off with the `bosh.yml` deployment manifest of the `bosh-deployment` repository.
From there, we can add customizations in the form of [BOSH operations files](https://bosh.io/docs/cli-ops-files/).
These operations files can be from three different sources:

1. Official operations files provided through the `bosh-deployment` repository.
2. Custom, environment-agnostic operations files that we maintain in the `base` repository.
3. Custom, environment-specific operations files that we maintain in the `environments` repository.

To make it easy to write these operations files, we'll introduce three environment variables to easily reference these locations: `$OPS_RELEASE`, `$OPS_BASE` and `$OPS_ENV`.
To properly establish the correct paths for these variables, it's helpful to have the locations of our three Git repositories available as environment variables as well: `$REPO_BASE`, `$REPO_ENV` and `$REPO_STATE`.
As the CI/CD server clones the repositories, it can also set the environment variables to actually point to the correct locations, so we'll assume they are properly set up.

 Now we can setup a basic deployment script:

```
# File: base/bosh/deploy.sh
# This script deploys a BOSH director

OPS_RELEASE="${REPO_BASE}/bosh/resources/bosh-deployment"
OPS_BASE="${REPO_BASE}/bosh"
OPS_ENV="${REPO_ENV}/$DEPLOYMENT_ENVIRONMENT/bosh"

# make sure we capture the BOSH state and creds when this script finishes in any case
BOSH_STATE_FILE="${REPO_STATE}/${DEPLOYMENT_ENVIRONMENT}-state.json"
BOSH_CREDS_FILE="${REPO_STATE}/${DEPLOYMENT_ENVIRONMENT}-creds.yml"
function update_state {
    git clone $REPO_STATE repo-state-updated
    if [[ -f "${BOSH_STATE_FILE}" ]]; then
        cp "$BOSH_STATE_FILE" "repo-state-updated/${DEPLOYMENT_ENVIRONMENT}-state.json"
    fi
    if [[ -f "${BOSH_CREDS_FILE}" ]]; then
        cp "$BOSH_STATE_FILE" "repo-state-updated/${DEPLOYMENT_ENVIRONMENT}-state.json"
    fi
    pushd repo-state-updated &>/dev/null
        git add -A
        git commit --allow-empty -m "Updating ${DEPLOYMENT_ENVIRONMENT}-state.json and ${DEPLOYMENT_ENVIRONMENT}-creds.yml"
    popd &>/dev/null
}
trap update_state EXIT

# deploy the BOSH director
bosh create-env $OPS_RELEASE/bosh.yml \
    -d $DEPLOYMENT_ENVIRONMENT \
    --state="$BOSH_STATE_FILE" \
    --vars-store="$BOSH_CREDS_FILE" \
    -o $OPS_RELEASE/vsphere/cpi.yml \
      -l $OPS_ENV/cpi.vars.yml \
    -o $OPS_BASE/apply-dns-config.ops.yml \
      -l $OPS_ENV/apply-dns-config.vars.yml
```

## Creating a Deployment Pipeline for the BOSH Director

Now that we have a script to deploy the BOSH director, we can integrate it into a pipeline.
To do that, we'll first create two reusable Concourse tasks.
The first one actually deploys the BOSH director:

```
# base/ci/tasks/bosh/deploy.yml
---
platform: linux

image_resource:
  type: docker-image
  source:
    repository: registry.gitlab.com/mimacom/cloud/automation-images/cfops-toolkit
    tag: latest

inputs:
- name: repo-base
- name: repo-env
- name: repo-state

outputs:
- name: repo-state-updated

params:
  DEPLOYMENT_ENVIRONMENT:
  REPO_BASE: 'repo-base'
  REPO_ENV: 'repo-env'
  REPO_STATE: 'repo-state'

run:
  path: repo-base/bosh/deploy.sh
```

> Heads up: we provide a Docker image that contains the most important tools to automate Cloud Foundry.
> Of course, feel free to fork and adjust it to your own needs.
>
> cfops-toolkit: https://gitlab.com/mimacom/cloud/automation-images/cfops-toolkit

### Smoke test the deployment

As a next step, let's see if the BOSH director deployment actually worked.
To do so, let's first create the concourse task definition:

```
# base/ci/tasks/bosh/smoke-test.yml
---
platform: linux

image_resource:
  type: docker-image
  source:
    repository: registry.gitlab.com/mimacom/cloud/automation-images/cfops-toolkit
    tag: latest

inputs:
- name: repo-base
- name: repo-env
- name: repo-state

params:
  DEPLOYMENT_ENVIRONMENT:
  REPO_BASE: 'repo-base'
  REPO_ENV: 'repo-env'
  REPO_STATE: 'repo-state'

run:
  path: repo-base/bosh/smoke-test.sh
```

The task merely calls a smoke test script that lives right next to the actual deploy script we created earlier.
To test whether the BOSH director deployment succeeded, we can try to authenticate with the BOSH director and perform some additional checks:

```
#!/usr/bin/env bash

set -eu

if [ -z $DEPLOYMENT_ENVIRONMENT ]; then
  echo "DEPLOYMENT_ENVIRONMENT environment variable not set"
  exit 1
fi

CREDS="${REPO_STATE}/${DEPLOYMENT_ENVIRONMENT}-creds.yml"
STATE="${REPO_STATE}/${DEPLOYMENT_ENVIRONMENT}-state.json"

OPS_ENV="${REPO_ENV}/${DEPLOYMENT_ENVIRONMENT}/bosh"
CPI_VARIABLES="${OPS_ENV}/cpi.vars.yml"

# Log in to the Director
export BOSH_DIRECTOR_IP=`bosh int $CPI_VARIABLES --path /internal_ip`
export BOSH_CLIENT=admin
export BOSH_CLIENT_SECRET=`bosh int $CREDS --path /admin_password`

# Configure local alias
bosh alias-env bosh -e $BOSH_DIRECTOR_IP --ca-cert <(bosh int $CREDS --path /director_ssl/ca)

# Query the Director for more info
bosh -e bosh env
# List stemcells
bosh -e bosh stemcells
```

### Wire the tasks to a pipeline

Now that we have both tasks ready to run, we need to wire them together in a pipeline:

```yml
# repo-base/ci/pipelines/bosh-pipeline.yml
resources:
- name: repo-base
  type: git
  source:
    uri: ssh://git-server/repo-base.git
    branch: master
    # checkout all submodules in the resources folders
    submodules: all
    submodule_recursive: true
- name: repo-env
  type: git
  source:
    uri: ssh://git-server/repo-env.git
    branch: master
- name: repo-state
  type: git
  source:
    uri: ssh://git-server/repo-state.git
    branch: master


jobs:
- name: deploy-bosh
  plan:
  - in_parallel:
    - get: repo-state
    - get: repo-env
    - get: repo-base
  - task: deploy bosh
    file: repo-base/ci/tasks/deploy-bosh.yml
    params:
      DEPLOYMENT_ENVIRONMENT: ((deployment_environment))
    ensure:
      put: repo-state
      params:
        repository: repo-state-updated

- name: smoke-test-bosh
  plan:
  - in_parallel:
    - get: repo-state
      passed: [deploy-bosh]
      trigger: true
    - get: repo-env
    - get: repo-base
  - task: smoke test bosh
    file: repo-base/ci/tasks/smoke-test-bosh.yml
    params:
      DEPLOYMENT_ENVIRONMENT: ((deployment_environment))

```

🎉 Wohoo! There you have it, a pipeline that rolls out a BOSH director.
