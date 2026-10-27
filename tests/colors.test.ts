import { describe, expect, it } from "vitest";
import { PALETTE, nextColor } from "../src/model/colors";
import { moved } from "../src/model/move";

describe("nextColor", () => {
  it("skips colours already used, ignoring case", () => {
    expect(nextColor([PALETTE[0].toUpperCase()])).toBe(PALETTE[1]);
  });
  it("cycles once the palette is used up", () => {
    expect(nextColor(PALETTE)).toBe(PALETTE[0]);
  });
});

describe("moved", () => {
  it("moves an item and leaves the original alone", () => {
    const items = ["a", "b", "c"];
    expect(moved(items, 0, 2)).toEqual(["b", "c", "a"]);
    expect(items).toEqual(["a", "b", "c"]);
  });
  it("ignores moves out of range", () => {
    expect(moved(["a"], 0, 1)).toEqual(["a"]);
  });
});
