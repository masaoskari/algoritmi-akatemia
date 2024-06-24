const withMDX = require("@next/mdx")();

const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  output: "export",
};

module.exports = withMDX(nextConfig);
