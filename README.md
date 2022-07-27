# remark-md2html-starter

Combine several commonly used plugins for compile markdown to html.

# Usage

```ts
import remarkStarter from "remark-md2html-starter";

const processor = remarkStarter();

const result = await processor.process(`# H1`);
```

```ts
// more options

processor = remarkStarter({
    allowHtml: true, // support embedded html
    math: true, // support math
    remarkPlugins: [...],
    rehypePlugins: [...],
  });
```
