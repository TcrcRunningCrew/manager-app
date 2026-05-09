import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "T.C.R.C 러닝크루",
    short_name: "TCRC",
    description: "T.C.R.C 러닝크루 출석 및 관리",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0D10",
    theme_color: "#C8FF3E",
    orientation: "portrait",
    categories: ["sports", "fitness"],
    icons: [
      {
        src: "/api/icons/192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/api/icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/api/icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
