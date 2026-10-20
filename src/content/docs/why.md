---
title: Why I built this
description: How Poundlock, Toolkit and Dispatch came about, what works, and what's still rough.
---

It started with me wanting to know how to actually make LLMs useful in my own
infrastructure. Not in a demo, but day to day, on machines I already own. That's where
[Toolkit](/poundlock-site/toolkit/) came from: before I could trust a local model with
anything, I needed to know what it could really do on my hardware.

Then I wanted flexibility. Different models are good for different things. A small one
is fine for completions in my editor, but planning a feature or reviewing a change needs
something bigger. My setup is a pretty ordinary home lab: a Linux machine with a GPU
that sleeps when it's idle, a Mac with a lot of memory, a small home server that runs
the controller, and the laptop where I actually work. Poundlock is what ties those
together, so everything talks to one endpoint and waits its turn.

And I didn't want to have to decide which model to use every time. I wanted the agent to
make that decision, with a way to escalate when it gets stuck, and to use a cloud
frontier model when it's really needed. Only when I've allowed it, and within a budget.

All of that came together into the servers and apps you see here.

## A process, not just a model

The big thing, beyond using my own infrastructure, is having a process for getting
quality output, and making sure jobs keep running and correct themselves. That's why
[Dispatch](/poundlock-site/dispatch/) splits development between a manager, a
planner and workers. Tools like gnhf work great, but they trust themselves too much, and
they don't have error correction.

Here, a model saying "done" doesn't count. Work is accepted when the tests really ran
and passed, the tests that were meant to stay fixed weren't edited, and the planner has
checked the result against what was asked for. When something fails, it gets another
attempt, a fresh start or a smaller piece, instead of being waved through.

So now I can hand off a project at night and review tested commits in the morning, all
on local models. I stopped picking models by hand. My editor, a chat app and the agents
all use the same endpoint. And because Toolkit showed me which local models actually
hold up, I know what I can hand them.

## What's still rough

Honestly, a fair amount.

- **Setup takes effort.** You need your own model servers running first. This isn't a
  one-click install.
- **Local models have limits.** They're slower and make more mistakes than frontier
  models. The process around them is what makes them useful.
- **Autopilot isn't fully baked.** The fully autonomous parts work, but they still need
  watching.
- **The apps are preview quality.** I'm not a frontend designer, so the desktop app and
  the terminal app look like engineering solutions, and the UX could use real work.
- **It's one person's project, in a field that moves fast.** Every time I finished
  something, the goalposts moved or a package I depended on changed, and I had to adapt.

## Who should try it

If you've got a GPU or two at home and want to see how far local models can go, or
you're a small team sharing hardware and want control over where your code goes, give it
a try.

The most useful thing you can do is tell me how it went: what was confusing, what broke,
what you expected and didn't find. [Issues](https://github.com/endthestart/poundlock/issues)
are the best place for that. Contributions are welcome too, especially help with UX and
design, and testing on hardware I don't have.

I built this with a lot of help from AI coding agents (Claude, and local models through
Dispatch), under my direction and review. The design, the tests and the release gates
are mine.
