import { isColor } from "./colors";
import { nameProblem, sameName } from "./names";

export interface ParsedLine {
  line: number;
  name: string;
  color: string | null;
  problem: string | null;
}

// One label per line, optionally followed by a colour: "Obligation #d62728",
// or a tab or comma before it, as pasted from a spreadsheet.
export function parseLabelList(text: string, existingNames: string[] = []): ParsedLine[] {
  const seen = [...existingNames];
  return text
    .split(/\r?\n/)
    .map((raw, i) => ({ raw: raw.trim(), line: i + 1 }))
    .filter(({ raw }) => raw !== "")
    .map(({ raw, line }) => {
      const match = raw.match(/^(.*?)[\s,;]*(#[0-9a-fA-F]{6})$/);
      const name = (match ? match[1] : raw).replace(/[\t,;]+$/, "").trim();
      const color = match && isColor(match[2]) ? match[2] : null;
      const problem =
        nameProblem(name) ?? (seen.some((s) => sameName(s, name)) ? "Already in the labelset" : null);
      if (!problem) seen.push(name);
      return { line, name, color, problem };
    });
}
