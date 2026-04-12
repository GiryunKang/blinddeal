import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BlindDeal — 부동산 · M&A 딜 정보 플랫폼",
    short_name: "BlindDeal",
    description: "부동산과 M&A 딜 정보를 공개 또는 비공개로 연결하세요.",
    start_url: "/deals",
    display: "standalone",
    background_color: "#0a0e1a",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    categories: ["business"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
