import { describe, expect, it } from "vitest";
import { nameProblem, duplicateIndexes } from "../src/model/names";

describe("nameProblem", () => {
  it.each(["Obligation", "Legal Relations", "Geographical - Physical Domains", "Art. 5", "Één", "Party (seller)", "R&D", "a_b", "-dash", "trailing_", "Two  spaces"])(
    "accepts %s",
    (name) => expect(nameProblem(name)).toBeNull(),
  );

  it.each([
    ["", "required"],
    [" Party", "spaces"],
    ["Party ", "spaces"],
    ["a,b", "only"],
    ['say "hi"', "only"],
    ["<b>", "only"],
    ["x".repeat(61), "longer"],
  ])("rejects %j", (name, hint) => expect(nameProblem(name)).toMatch(hint));

  it("accepts everything the earlier ASCII rule accepted", () => {
    const earlier = /^[a-zA-Z0-9 \- \_]+$/;
    const trimmed = /^[^\s]+(\s+[^\s]+)*$/;
    for (const name of ["a", "A-b_c 9", "--", "_x_", "x  y", "Label 10"])
      if (earlier.test(name) && trimmed.test(name)) expect(nameProblem(name)).toBeNull();
  });
});

describe("duplicateIndexes", () => {
  it("marks every case-insensitive duplicate", () => {
    expect([...duplicateIndexes(["Party", "Date", "party"])].sort()).toEqual([0, 2]);
  });
});
