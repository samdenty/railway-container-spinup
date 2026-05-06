import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  compiler: {
    relay: {
      src: "./src",
      artifactDirectory: "./src/__generated__",
      language: "typescript",
      eagerEsModules: true,
    },
  },
};

export default nextConfig;
