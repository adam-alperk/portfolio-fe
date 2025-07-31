import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "your-strapi-domain.com"],
  },
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   config.module.rules.push({
  //     test: /\.(glb|gltf)$/,
  //     use: {
  //       loader: "file-loader",
  //     },
  //   });
  //   return config;
  // },
};

export default nextConfig;
