---
title: How the pieces fit
description: Poundlock, Toolkit and Dispatch, and which one does what.
---

There are three projects. You can use any one of them without the others.

**Poundlock** runs on a server in your house. It knows about your machines and the
models they serve. It wakes a machine when there's work for it, lets one request at a
time onto a model that can only handle one, and gives every application its own token.
It can also run a coding job in an isolated container and hand back the patch. It
doesn't plan work or decide what to build.

**Toolkit** is a command-line tool you run when you're choosing a model. Point it at a
machine, and it tests the models, runtimes and settings you're considering, then shows
you how they actually did. It measures and reports. It never changes how anything runs.

**Dispatch** is the part you talk to. It's a desktop and terminal app that turns a
request into a plan, hands the pieces to local models through Poundlock, and checks
what comes back before anything reaches your files. It's being prepared for release.

## A typical setup

1. You run Toolkit on the machine with the GPU and find a model that handles tool
   calls reliably at the context size you need.
2. You add that model to Poundlock, and give your editor a token that can only list
   models and send requests.
3. Your editor, a chat app and Dispatch all use the same address. When the GPU is
   busy, they wait their turn. When it's asleep, the first request wakes it.

## Who owns what

- Poundlock owns machines, models, who gets in, and anything that runs on the server.
- Dispatch owns projects, plans, permissions and review.
- Toolkit measures and never controls.

Each has its own version number. The [roadmap](/poundlock-site/roadmap/) lists the
versions released together and what comes next.
