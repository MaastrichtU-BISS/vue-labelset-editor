import { isColor } from "./colors";
import { duplicateIndexes, nameProblem } from "./names";
import type { Issue, Labelset } from "./types";

export interface ValidateOptions {
  requireDescription?: boolean;
}

export function validateLabelset(labelset: Labelset, options: ValidateOptions = {}): Issue[] {
  const issues: Issue[] = [];
  if (labelset.name.trim() === "") issues.push({ field: "name", message: "Give the labelset a name" });
  if ((options.requireDescription ?? true) && labelset.desc.trim() === "")
    issues.push({ field: "desc", message: "Describe what the labelset is for" });
  if (labelset.labels.length === 0) issues.push({ field: "labels", message: "Add at least one label" });

  const labelDuplicates = duplicateIndexes(labelset.labels.map((l) => l.name));
  labelset.labels.forEach((label, index) => {
    const problem =
      nameProblem(label.name) ??
      (labelDuplicates.has(index) ? "Another label has this name" : null) ??
      (isColor(label.color) ? null : "Colour must look like #1a2b3c");
    if (problem) issues.push({ field: "label", index, message: problem });
  });

  const relationLabels = labelset.relation_labels ?? [];
  const relationDuplicates = duplicateIndexes(relationLabels);
  relationLabels.forEach((name, index) => {
    const problem = nameProblem(name) ?? (relationDuplicates.has(index) ? "Another relation label has this name" : null);
    if (problem) issues.push({ field: "relation_label", index, message: problem });
  });

  return issues;
}

export const isValidLabelset = (labelset: Labelset, options?: ValidateOptions) =>
  validateLabelset(labelset, options).length === 0;
