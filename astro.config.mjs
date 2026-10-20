import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://endthestart.github.io",
  base: "/poundlock-site",
  integrations: [
    starlight({
      title: "Poundlock",
      logo: { src: "./src/assets/poundlock.svg" },
      customCss: ["./src/styles/brand.css"],
      description:
        "One OpenAI-compatible endpoint for the model servers on your own machines, plus the tools around it.",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/endthestart/poundlock" }],
      lastUpdated: false,
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "What this is", link: "/" },
            { slug: "why" },
            { slug: "how-it-fits" },
            { slug: "compare" },
          ],
        },
        { label: "Poundlock", items: [{ autogenerate: { directory: "poundlock" } }] },
        { label: "Dispatch", items: [{ autogenerate: { directory: "dispatch" } }] },
        { label: "Toolkit", items: [{ autogenerate: { directory: "toolkit" } }] },
        { slug: "roadmap" },
      ],
    }),
  ],
});
