export const MAX_NAME_LENGTH = 60;

// Letters and digits in any script, so "Één" and "Überweisung" are fine, plus
// the punctuation label names use in practice. Commas, quotes and angle
// brackets stay out: labels end up as CSV cells and attribute values. Every
// name the earlier ASCII-only rule allowed is still allowed.
const ALLOWED = /^[\p{L}\p{N} \-_'()&/.]+$/u;

export function nameProblem(name: string): string | null {
  if (name.trim() === "") return "Name is required";
  if (name !== name.trim()) return "Name can't start or end with spaces";
  if (name.length > MAX_NAME_LENGTH) return `Name is longer than ${MAX_NAME_LENGTH} characters`;
  if (!ALLOWED.test(name)) return "Use letters, digits, spaces and - _ ' ( ) & / . only";
  return null;
}

export const sameName = (a: string, b: string) => a.toLocaleLowerCase() === b.toLocaleLowerCase();

export function duplicateIndexes(names: string[]): Set<number> {
  const duplicates = new Set<number>();
  names.forEach((name, i) => {
    names.forEach((other, j) => {
      if (i !== j && sameName(name, other)) duplicates.add(i);
    });
  });
  return duplicates;
}
