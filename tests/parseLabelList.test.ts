import { describe, expect, it } from "vitest";
import { parseLabelList } from "../src/model/parseLabelList";

describe("parseLabelList", () => {
  it("reads names and optional colours, skipping blank lines", () => {
    const lines = parseLabelList("Obligation #D62728\n\nParty\tsomething #1f77b4\nDate,#2ca02c\nRight");
    expect(lines.map(({ name, color, problem }) => [name, color, problem])).toEqual([
      ["Obligation", "#D62728", null],
      ["Party\tsomething", "#1f77b4", "Use letters, digits, spaces and - _ ' ( ) & / . only"],
      ["Date", "#2ca02c", null],
      ["Right", null, null],
    ]);
  });

  it("flags names already present or repeated in the paste", () => {
    const lines = parseLabelList("Party\nparty\nDate", ["DATE"]);
    expect(lines.map((l) => l.problem)).toEqual([null, "Already in the labelset", "Already in the labelset"]);
  });
});
