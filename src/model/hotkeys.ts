// The same order legal-annotation-kit arms labels in: 1–9, 0, then a–z.
const KEYS = [..."1234567890", ..."abcdefghijklmnopqrstuvwxyz"];

export const defaultHotkey = (index: number): string => KEYS[index] ?? "";
