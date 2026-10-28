# Poundlock site

The source of [endthestart.github.io/poundlock-site](https://endthestart.github.io/poundlock-site/):
a front page, a few pages about how the projects fit together, and the guides from
[Poundlock](https://github.com/endthestart/poundlock),
[Poundlock Dispatch](https://github.com/endthestart/poundlock-dispatch) and
[Poundlock Toolkit](https://github.com/endthestart/poundlock-toolkit).

The guides live in those repositories, not here. `scripts/sync-docs.mjs` copies them
in at build time, so fix a guide where it lives and rebuild. Pages written for the site
itself are in `src/content/docs`. `.github/workflows/deploy.yml` builds and publishes
the site to GitHub Pages on every push to `main` and once a day, so a guide changed in a
product repository reaches the site within a day.

```sh
npm ci
POUNDLOCK_SRC=../poundlock DISPATCH_SRC=../poundlock-dispatch TOOLKIT_SRC=../poundlock-toolkit npm run dev
```

Built with [Astro Starlight](https://starlight.astro.build). Apache-2.0.
