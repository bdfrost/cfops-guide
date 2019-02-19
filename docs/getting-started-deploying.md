---
id: getting-started-deploying
title: Deploying
---

This section provides guides on how to perform a specific part of the deployment.

> **Heads up**: Basic Bash and Git knowledge is assumed here.

## Deploy Everything from Scratch

To deploy the cloud setup from scratch you need to perform the following steps:

1. [Deploy the Automation Environment](#deploy-the-automation-environment)
1. For each environment deploy in this order:
    1. Deploy the BOSH director
    1. Tailor the Cloud Config to match your environment
    1. Deploy each product


## Deploy the Automation Environment

Setting up an automation environment is the recommended way to automate your cloud setup.
Throughout this guide we will solely be using [Concourse](https://concourse-ci.org).

> **Heads up**: In case you are unfamiliar with Concourse you may first take a look at the [Concourse Tutorial](https://concoursetutorial.com) and then continue with the automation setup described here.

All further deployments are then done by triggering a Concourse pipeline. Follow these steps to set up Concourse and the respective pipelines: