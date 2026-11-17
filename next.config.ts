import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // A stray package-lock.json in the parent folder makes Next guess the wrong workspace root.
  turbopack: { root: __dirname },
  // DIIL for startups moved from /founder to /founders.
  async redirects() {
    return [{ source: "/founder", destination: "/founders", permanent: true }];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
