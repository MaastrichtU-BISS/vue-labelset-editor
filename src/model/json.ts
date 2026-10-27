import type { Label, Labelset } from "./types";

export function labelsetToJson(labelset: Labelset): string {
  const { name, desc, labels, relation_labels } = labelset;
  return JSON.stringify({ name, desc, labels, relation_labels: relation_labels ?? null }, null, 2);
}

const asLabels = (value: unknown): Label[] | null =>
  Array.isArray(value) &&
  value.every((l) => l && typeof l.name === "string" && typeof l.color === "string")
    ? value.map((l) => ({ name: l.name, color: l.color }))
    : null;

const asStrings = (value: unknown): string[] | null =>
  Array.isArray(value) && value.every((v) => typeof v === "string") ? [...value] : null;

/**
 * Reads a labelset from JSON: one exported by this package, a whole task
 * export that contains a `labelset`, or a bare array of labels.
 */
export function labelsetFromJson(text: string): Labelset {
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("This is not valid JSON");
  }
  const source = data && !Array.isArray(data) && data.labelset ? data.labelset : data;
  const labels = asLabels(Array.isArray(source) ? source : source?.labels);
  if (!labels) throw new Error("No list of labels with a name and colour was found");
  return {
    name: typeof source?.name === "string" ? source.name : "",
    desc: typeof source?.desc === "string" ? source.desc : "",
    labels,
    relation_labels: asStrings(source?.relation_labels ?? data?.relation_labels),
  };
}
