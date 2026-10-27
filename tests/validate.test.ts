import { describe, expect, it } from "vitest";
import { validateLabelset } from "../src/model/validate";

const base = { name: "Contracts", desc: "Clauses", labels: [{ name: "Party", color: "#1f77b4" }] };

describe("validateLabelset", () => {
  it("accepts a complete labelset", () => expect(validateLabelset(base)).toEqual([]));

  it("needs a name, a description and a label", () => {
    const fields = validateLabelset({ name: " ", desc: "", labels: [] }).map((i) => i.field);
    expect(fields).toEqual(["name", "desc", "labels"]);
  });

  it("can drop the description requirement", () => {
    expect(validateLabelset({ ...base, desc: "" }, { requireDescription: false })).toEqual([]);
  });

  it("points at the offending label rows", () => {
    const issues = validateLabelset({
      ...base,
      labels: [base.labels[0], { name: "party", color: "#000000" }, { name: "Date", color: "red" }],
    });
    expect(issues.map((i) => [i.field, i.index])).toEqual([
      ["label", 0],
      ["label", 1],
      ["label", 2],
    ]);
  });

  it("checks relation labels the same way", () => {
    const issues = validateLabelset({ ...base, relation_labels: ["Cites", "cites", ""] });
    expect(issues.map((i) => i.index)).toEqual([0, 1, 2]);
  });

  it("treats null relation labels as the default set", () => {
    expect(validateLabelset({ ...base, relation_labels: null })).toEqual([]);
  });
});
