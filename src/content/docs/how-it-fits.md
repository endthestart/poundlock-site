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

**Dispatch** is the part you talk to. It comes as a desktop app and a terminal client
that share the same projects and settings. You talk to a project manager; it agrees a
plan with you and hands the tasks to workers, which edit your project. The project's
checks and the manager's review decide what's accepted.

Dispatch runs work in three ways:

- **Attached work**, the default, runs on your machine in your project folder, under the
  permission mode you choose. Close the app and it stops; reopen it and you pick up
  where you left off.
- **Autopilot** (a preview) works through an agreed plan by itself, in a container on a
  separate VM with a private copy of your project. It keeps going if you close the app.
- **Durable jobs** run on the Poundlock server, in restricted containers, when you hand
  one off by hand with `dispatch jobs`.

In the first two, only the model runs elsewhere. The code runs on your machine.

## A typical setup

1. You run Toolkit on the machine with the GPU and find a model that handles tool
   calls reliably at the context size you need.
2. You add that model to Poundlock, and give your editor a token that can only list
   models and send requests.
3. Your editor, a chat app and Dispatch all use the same address. When the GPU is
   busy, they wait their turn. When it's asleep, the first request wakes it.
4. In Dispatch, you describe what you want built. The manager plans it with you, and
   the workers do the edits on whichever local model you've bound to them.

## Who owns what

- Poundlock owns machines, models, who gets in, and anything that runs on the server.
- Dispatch owns projects, plans, permissions and review.
- Toolkit measures and never controls.

Each has its own version number. The [roadmap](/poundlock-site/roadmap/) lists the
versions released together and what comes next.
