import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sumpreeth Tours and Travels",
    short_name: "Sumpreeth",
    description:
      "24/7 cabs, tempo travellers and buses for airport, local and outstation trips across Karnataka and South India.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f1",
    theme_color: "#0f2d18",
    lang: "en-IN",
    categories: ["travel", "business"],
    icons: [
      { src: "/icon.png", sizes: "256x256", type: "image/png", purpose: "any" },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
