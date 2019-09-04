---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

Welcome!
This guide will teach you how to operate any [Open Source Cloud Foundry](https://docs.cloudfoundry.org) deployment in a production setup.
We cover deploying the BOSH director, Concourse as automation tool, Open Source Cloud Foundry itself, and taking care of buildpacks.

> **Heads up**: This guide is still a work in progress. 
> Check back soon to discover more contents or have a [look at the changelog](changelog.md) to discover what has changed recently.


## 💡 Why Open Source Cloud Foundry?

We have written this guide as reference documentation for several setups we use at customers to run productive environments.
As we found that we were talking about the same concepts over and over again, it was clear that we were onto something that may also turn out to be useful for others.
That's why we have started writing down

So there is one question that still remains before diving into technical details: 
Why would you want to run Open Source Cloud Foundry in the first place?

- **Privacy**: If you run and host Cloud Foudry yourself you can leverage the benefits of cloud computing on machines that you own.
  Your applications can handle critical and senstivie workloads protected by your environment and Cloud Foundry on top, all while giving developers a highly productive and secure cloud platform.
- **Control**: If you run it, you own it. You have the freedom to configure the platform to your needs, set the upgrade pace how it suits your business and be in the drivers' seat.
  With that freedom, you also have the responsibility to professionally operate the platform, which this guide will teach you how to do.
- **Access**: Hosting the platform yourself means you can access and inspect all relevant parts of the platfom.
  There is no magic going on and you can verify that the platform is as secure as it claims to be.


## 👋 Contributions Welcome!

 If you have questions or trouble understanding parts of the guide you're invited to raise an issue on [GitHub](https://github.com/mimacom/cloud-automation/issues/new).
Also, if you spot anything which needs an improvement, you're welcome to [submit a PR](https://github.com/mimacom/cloud-automation) to the repository of this documentation.