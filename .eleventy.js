import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md");
  });
  eleventyConfig.addPassthroughCopy({ "src/css": "css", "src/js": "js" });
  eleventyConfig.addWatchTarget("src/css");
  eleventyConfig.addWatchTarget("src/js");
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
