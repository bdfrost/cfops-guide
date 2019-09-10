---
id: concourse-deploying-concourse
title: Deploying Concourse
---

[Concourse](https://concourse-ci.org) is a highly versatile continuous-thing-doer and ideally suited for all automation tasks around Cloud Foundry.
Concourse has [different deployment options](https://concourse-ci.org/install.html), of which one is a [BOSH deployment](https://github.com/concourse/concourse-bosh-deployment), which we will be using to stand up Concourse.
If you intend to setup Concourse on AWS or GCP you may also use the [concourse-up](https://github.com/EngineerBetter/concourse-up) tool, which greatly simplifies deployments to those two platforms.

> **Heads up:** To continue here, you must already have setup and configured a BOSH Director.
> If you haven't done so, first go throught the [Deploying BOSH](bosh-deployment.md) section.

## Setting the BOSH Cloud Config

Setting the [BOSH cloud configuration](https://bosh.io/docs/cloud-config/) is a very important part in preparing the Concourse deployment.
The cloud config defines the IP address ranges that we can use, the VM and disk sizes, availability zones, and lots more.

```bash
# File: environments/automation/update-bosh-configs.sh
# This script configures BOSH cloud and runtime configs specifically for the automation environment

OPS_RELEASE="${REPO_BASE}/bosh/resources/bosh-deployment"
OPS_BASE="${REPO_BASE}/bosh"
OPS_ENV="${REPO_ENV}/$DEPLOYMENT_ENVIRONMENT/concourse"
OPS_ENV_BOSH="${REPO_ENV}/$DEPLOYMENT_ENVIRONMENT/bosh"

bosh -e automation update-cloud-config "${OPS_RELEASE}/vsphere/cloud-config.yml" \
    -l $OPS_ENV_BOSH/cpi.vars.yml \
    -o $OPS_BASE/vm-types.yml

bosh -e automation update-runtime-config -n $OPS_RELEASE/runtime-configs/dns.yml --name dns
```

The custom operations file is used to customize the vm types and disk sizes available for BOSH deployments.
Use the cloud config to vertically scale your Concourse deployment to your liking.
The names and sizings you choose in the cloud config are used in the next section, the actual Concourse deployment.

## Deploying Concourse as BOSH Deployment

[Concourse ships as BOSH release](https://github.com/concourse/concourse-bosh-deployment) which serves as the foundation for this deployment. 
As we are going to deploy from the Concourse BOSH release repository we add that as submodule:

```bash
git submodule add \
    https://github.com/concourse/concourse-bosh-deployment.git \
    environments/concourse/resources/concourse-bosh-deployment
git submodule update --init
```

Before we `bosh deploy` the Concourse deployment first a compatible stemcell needs to be uploaded to the fresh BOSH director.
Head over to the [BOSH stemcells](https://bosh.io/stemcells/) and choose an appropriate stemcell for Concourse and upload it to the BOSH director.
Now that we have the stemcell, we can configure the Concourse BOSH deployment in a separate script:

```bash
# File: environments/concourse/deploy-concourse.sh
# Deploys a Concourse instance

OPS_RELEASE="${REPO_BASE}/concourse/resources/concourse-bosh-deployment"
OPS_BASE="${REPO_BASE}/concourse"
OPS_ENV="${REPO_ENV}/$DEPLOYMENT_ENVIRONMENT/concourse"
OPS_ENV_BOSH="${REPO_ENV}/$DEPLOYMENT_ENVIRONMENT/bosh"


#!/bin/bash
bosh -e automation deploy -d concourse $OPS_RELEASE/cluster/concourse.yml \
  -v deployment_name=concourse \
  -l $OPS_ENV_BOSH/cpi.vars.yml \
  -l $OPS_RELEASE/versions.yml \
  -o $OPS_ENV/enable-basic-authentication.yml \
    -v concadmin_username=$CONCOURSE_ADMIN_USERNAME \
  -o $OPS_ENV/configure-certificates.yml \
    -v concourse_hostname=$CONCOURSE_IP
```

🎉 Wohoo! There you have a fresh Concourse deployment