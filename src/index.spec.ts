import "mocha";
import { expect } from "chai";

import remarkStarter from "./index";

describe("processor", () => {
  let processor = remarkStarter();

  it("should be a function", () => {
    expect(processor).to.be.instanceOf(Function);
  });

  it("should parse the markdown to html and get frontmatter info", async () => {
    const file = "---\nfoo: bar\n---\n# Hello, world!\n";
    const result = await processor.process(file);

    expect(result).to.be.instanceOf(Object);
    expect(result.data).to.be.instanceOf(Object);
    expect(result.data.foo).to.be.eq("bar");
    expect(result.value).to.be.eq("<h1>Hello, world!</h1>");
  });
});
