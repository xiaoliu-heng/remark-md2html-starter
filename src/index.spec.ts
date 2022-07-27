import "mocha";
import { expect } from "chai";

import remarkStarter from "./index";

describe("processor", () => {
  let processor = remarkStarter({ allowHtml: true, math: true });

  it("should be a function", () => {
    expect(processor).to.be.instanceOf(Function);
  });

  it("should parse the markdown to html and get frontmatter info", async () => {
    const file = "---\nfoo: bar\n---\n# Hello, world!\n";
    const result = await processor.process(file);

    expect(result).to.be.instanceOf(Object);
    expect(result.data).to.be.instanceOf(Object);
    expect(result.data.foo).to.be.eq("bar");
    expect(result.value).to.be.includes("<h1>Hello, world!</h1>");
  });

  it("should parse the markdown to html and get frontmatter info with yaml", async () => {
    const file = "---\nfoo: bar\n---\n# Hello, world!\n";
    const result = await processor.process(file);

    expect(result).to.be.instanceOf(Object);
    expect(result.data).to.be.instanceOf(Object);
    expect(result.data.foo).to.be.eq("bar");
    expect(result.value).to.be.includes("<h1>Hello, world!</h1>");
  });

  it("should parse the markdown to html and keep the embedded html", async () => {
    const file = "# Hello, world!\n<div>Hello, world!</div>";
    const result = await processor.process(file);

    expect(result).to.be.instanceOf(Object);
    expect(result.value).to.be.includes("<div>Hello, world!</div>");
  });

  it("should parse the markdown to html and parse the math", async () => {
    const file = "# Hello, world!\n$$\n1+1\n$$";
    const result = await processor.process(file);

    expect(result).to.be.instanceOf(Object);
    expect(result.value).to.be.includes(
      '<span class="katex"><span class="katex-mathml"><math'
    );
  });
});
