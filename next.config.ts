import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "blogus.cinemaxmx.com", pathname: "/media/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
