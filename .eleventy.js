import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it";
import dotenv from "dotenv";

dotenv.config();

export default function (eleventyConfig) {
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(function (md) {
    const defaultRender =
      md.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const token = tokens[idx];
      const href = token.attrGet("href");
      if (href && !href.startsWith("/")) {
        token.attrSet("target", "_blank");
        token.attrSet("rel", "noopener noreferrer");
      }
      return defaultRender(tokens, idx, options, env, self);
    };
  });

  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });
  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/js": "js", "src/assets": "assets" });
  eleventyConfig.addWatchTarget("src/css");
  eleventyConfig.addWatchTarget("src/js");
  eleventyConfig.addWatchTarget("src/assets");
  eleventyConfig.addFilter("formatDate", (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    const baseUrl = base || "/blog";
    return `${baseUrl}${url}`;
  });

  return {
    pathPrefix: "/blog/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
}
