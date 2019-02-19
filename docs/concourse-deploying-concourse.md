---
id: concourse-deploying-concourse
title: Deploying Concourse
---

[Concourse](https://concourse-ci.org) is a highly versatile continuous-thing-doer and ideally suited for all automation tasks around Cloud Foundry.
Concourse has [different deployment options](https://concourse-ci.org/install.html), of which one is a [BOSH deployment](https://github.com/concourse/concourse-bosh-deployment), which we will be using to stand up Concourse.
If you intend to setup Concourse on AWS or GCP you may also use the [concourse-up](https://github.com/EngineerBetter/concourse-up) tool, which greatly simplifies deployments to those two platforms.

By the end of this tutorial you will have:

- A running Concourse server
- CredHub integration for both, BOSH and Concourse
- An offline-ready installation
- A nice directory layout with scripts to deploy everything

The deployment of Concourse boils down to these three steps:

1. Deploy a fresh BOSH director
1. Set the cloud config we want to use for the Concourse deployment
1. Deploy Concourse

