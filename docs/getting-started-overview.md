---
id: getting-started-overview
title: Overview
---

In this guide you will learn how to run and operate several projects that form the overall cloud platform you will build.
The following picture depicts an overview of the setup we describe here in this guide:

TODO: add image here

We will mainly focus on building two [environments](TODO link to environments section): an *automation environment* leveraging Concourse to automate operational aspects, and one (or several) *Cloud Foundry environments* that host the platform and serve the apps.

Each environment consists of a BOSH director, which is the deployment orchestration tool used to spin up the whole environment.
While we can manually use BOSH to deploy things we want the BOSH deployments to be automatically run from our automation environment.
So in fact, the automation environment will be the only environment you will deploy manually.
However, keep in mind that the automation uses the exact same tools as you do in a manual deployment.

In this first chapter of the guide you will learn general concepts that apply to all environments.
The following chapters will teach you how to setup and configure each of the environments.