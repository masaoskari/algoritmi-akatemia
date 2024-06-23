import remarkFrontmatter from "remark-frontmatter";
import nextMDX from "@next/mdx";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeHighlight from "rehype-highlight";

const withMDX = nextMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [rehypeHighlight],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /*   webpack: (config, { isServer }) => {
    if (!isServer) {
      //config.plugins.push(new PyodidePlugin());
      config.resolve.alias["node-fetch"] = false;
    }
    if (isServer) {
      config.externals = ["pyodide", ...(config.externals || [])];
    }
    return config;
  }, */
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
};

export default withMDX(nextConfig);
