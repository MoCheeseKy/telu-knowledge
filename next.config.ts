import type { NextConfig } from "next";

const supabaseImageHost = process.env.SUPABASE_IMAGE_HOST?.trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/.*$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImageHost
      ? [
          {
            protocol: "https",
            hostname: supabaseImageHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/discover-forums",
        destination: "/discovers-forums",
      },
      {
        source: "/discover-articles",
        destination: "/discovers-articles",
      },
      {
        source: "/discover-articles/:path*",
        destination: "/discovers-articles/:path*",
      },
      {
        source: "/library",
        destination: "/librarys",
      },
    ];
  },
};

export default nextConfig;
