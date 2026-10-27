// Twenty colours far enough apart to tell labels apart at a glance, dark
// enough to read as a highlight on white.
export const PALETTE = [
  "#1f77b4", "#d62728", "#2ca02c", "#ff7f0e", "#9467bd",
  "#8c564b", "#e377c2", "#17becf", "#bcbd22", "#7f7f7f",
  "#393b79", "#ad494a", "#637939", "#e6550d", "#7b4173",
  "#3182bd", "#31a354", "#843c39", "#d6616b", "#5254a3",
];

export const isColor = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);

export function nextColor(used: string[]): string {
  const taken = new Set(used.map((c) => c.toLowerCase()));
  return PALETTE.find((c) => !taken.has(c)) ?? PALETTE[used.length % PALETTE.length];
}
