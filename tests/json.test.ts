import { describe, expect, it } from "vitest";
import { labelsetFromJson, labelsetToJson } from "../src/model/json";

const labelset = {
  name: "Contracts",
  desc: "Clauses",
  labels: [{ name: "Party", color: "#1f77b4" }],
  relation_labels: ["Cites"],
};

describe("labelset JSON", () => {
  it("round-trips", () => expect(labelsetFromJson(labelsetToJson(labelset))).toEqual(labelset));

  it("reads the labelset out of a task export", () => {
    const exported = JSON.stringify({ name: "Task", labelset: { name: "Contracts", desc: "", labels: labelset.labels } });
    expect(labelsetFromJson(exported)).toEqual({ name: "Contracts", desc: "", labels: labelset.labels, relation_labels: null });
  });

  it("reads a bare list of labels", () => {
    expect(labelsetFromJson(JSON.stringify(labelset.labels)).labels).toEqual(labelset.labels);
  });

  it("explains what is wrong", () => {
    expect(() => labelsetFromJson("{")).toThrow("not valid JSON");
    expect(() => labelsetFromJson('{"labels":[{"name":1}]}')).toThrow("No list of labels");
  });
});
