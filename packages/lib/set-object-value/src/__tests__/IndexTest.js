"use strict";

import set from "../index.js";
import { expect } from "chai";

describe("Test set", () => {
  it("check set result", () => {
    const obj = {};
    set(obj, ["a", "b"], "c");
    expect(obj).to.deep.equal({ a: { b: "c" } });
  });
});

describe("Test append", () => {
  it("test simple append", () => {
    const obj = {};
    set(obj, ["a"], "a1", true);
    set(obj, ["a"], "a2", true);
    expect(obj).to.deep.equal({ a: ["a1", "a2"] });
  });
  it("should keep origin value", () => {
    const obj = {};
    set(obj, ["a"], "a3");
    set(obj, ["a"], "a4", true);
    expect(obj).to.deep.equal({ a: ["a3", "a4"] });
  });
});

describe("Prototype pollution", () => {
  it("test Prototype pollution", () => {
    const obj = {};
    set(obj, ['__proto__','polluted'], "a1");
    expect(obj.polluted).to.equal("a1");
    expect({}.polluted).to.not.equal("a1");
    expect({}.polluted).to.equal(undefined);
  });
});
