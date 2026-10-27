export const DEFAULT_RELATION_LABELS = [
  "Is a",
  "Has a",
  "Belongs to",
  "Implies",
  "Depends on",
  "Related to",
  "Is not",
  "Part of",
];

export const effectiveRelationLabels = (relationLabels: string[] | null | undefined) =>
  relationLabels ?? DEFAULT_RELATION_LABELS;
