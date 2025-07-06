import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow base64 image data URLs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Allow Sharp to optimize images
  webpack: (config) => {
    config.resolve.alias.sharp = "sharp";
    return config;
  },
  // Enable standalone output for Docker deployment
  output: "standalone",
};

export default nextConfig;
