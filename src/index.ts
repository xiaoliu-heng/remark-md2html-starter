import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeDocument from "rehype-document";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";
import { parse as yamlParser } from "yaml";

import type { Plugin, Processor } from "unified";

type PluginList = (Plugin | [Plugin, any | [boolean]] | null)[];

interface remarkStarterOptions {
  /**
   * Allow HTML in the input markdown and keep it in the output html.
   */
  allowHtml?: boolean;
  /**
   * Enable math support.
   * @default false
   * @type {boolean}
   * @memberof remarkStarterOptions
   * @description if you want to use KaTeX. which will also add a css file to your page use the `remark-document` plugin.
   */
  math?: boolean;
  remarkPlugins?: PluginList;
  rehypePlugins?: PluginList;
}

const applyPlugins = (plugins: PluginList, chain: Processor) => {
  plugins.forEach((plugin) => {
    if (!plugin) return;

    if (Array.isArray(plugin)) {
      const [pluginName, pluginSettings] = plugin;
      console.log(pluginName, pluginSettings);
      chain.use(pluginName, pluginSettings);
    } else {
      chain.use(plugin);
    }
  });
};

const remarkStarter = ({
  allowHtml = false,
  math = false,
  rehypePlugins = [],
  remarkPlugins = [],
}: remarkStarterOptions = {}) => {
  const internalRemarkPlugins: PluginList = [
    remarkFrontmatter,
    [remarkExtractFrontmatter, { yaml: yamlParser }],
    math ? remarkMath : null,
    remarkGfm,
  ];
  const internalRehypePlugins: PluginList = [
    allowHtml ? rehypeRaw : null,
    math ? rehypeKatex : null,
    rehypeHighlight,
    math
      ? [
          rehypeDocument,
          {
            css: "https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css",
          },
        ]
      : null,
  ];

  const chain = unified().use(remarkParse);

  applyPlugins(internalRemarkPlugins, chain);
  applyPlugins(remarkPlugins, chain);

  chain.use(remarkRehype, { allowDangerousHtml: allowHtml });

  applyPlugins(internalRehypePlugins, chain);
  applyPlugins(rehypePlugins, chain);

  return chain.use(rehypeStringify);
};

export default remarkStarter;
