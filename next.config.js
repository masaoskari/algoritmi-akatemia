const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
const withMDX = require("@next/mdx")();

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // Development phase configuration
    return withMDX({
      // Development-specific configuration here
      // For example, no basePath is set for development
      pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    });
  }

  // Configuration for all other phases (including build)
  return withMDX({
    // Common configuration for all phases except development
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    output: "export",
    basePath: "/", // basePath is set only for build and other non-development phases
  });
};
