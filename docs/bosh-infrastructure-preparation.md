---
id: bosh-infrastructure-preparation
title: Infrastructure Preparation
---

In order to deploy a BOSH director, you need to prepare some of the underlying infrastructure.
This page summarizes the most common things you would want to configure to deploy a BOSH director for production use.

## Requirements

The following things should be in place before you start deploying.

#### Network
- You need a network range to deploy the BOSH director into (e.g. `10.0.23.0/24`)
- The BOSH director needs to be deployed to a single, static IP address within that range (e.g. `10.0.23.10`)

#### Domain Name
- It's useful to make the BOSH director available through it's own DNS name. 
  Setup your Load Balancer and/or DNS system to resolve the BOSH director hostname to the static IP address you defined above.
