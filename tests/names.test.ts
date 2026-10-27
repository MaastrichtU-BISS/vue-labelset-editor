import { describe, expect, it } from "vitest";
import { nameProblem, duplicateIndexes } from "../src/model/names";

describe("nameProblem", () => {
  it.each(["Obligation", "Legal Relations", "Geographical - Physical Domains", "Art. 5", "Één", "Party (seller)", "R&D", "a_b"])(
    "accepts %s",
    (name) => expect(nameProblem(name)).toBeNull(),
  );

  it.each([
    ["", "required"],
    [" Party", "spaces"],
    ["Party ", "spaces"],
    ["Two  spaces", "repeated"],
    ["a,b", "only"],
    ['say "hi"', "only"],
    ["<b>", "only"],
    ["-dash", "only"],
    ["x".repeat(61), "longer"],
  ])("rejects %j", (name, hint) => expect(nameProblem(name)).toMatch(hint));
});

describe("duplicateIndexes", () => {
  it("marks every case-insensitive duplicate", () => {
    expect([...duplicateIndexes(["Party", "Date", "party"])].sort()).toEqual([0, 2]);
  });
});
