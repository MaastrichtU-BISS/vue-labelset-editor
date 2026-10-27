export interface Label {
  name: string;
  color: string;
}

export interface Labelset {
  name: string;
  desc: string;
  labels: Label[];
  /** Labels a relation can be given. Null or absent means the host's default set. */
  relation_labels?: string[] | null;
}

export type IssueField = "name" | "desc" | "labels" | "label" | "relation_label";

export interface Issue {
  field: IssueField;
  /** Position in labels or relation_labels, for per-row issues. */
  index?: number;
  message: string;
}
