# vue-labelset-editor

A Vue component for creating and editing annotation label sets: labels and their
colours, their order, relation labels, bulk entry and JSON import/export.

```bash
npm install vue-labelset-editor
```

```vue
<script setup lang="ts">
import { ref } from "vue";
import { LabelsetEditor, isValidLabelset, type Labelset } from "vue-labelset-editor";
import "vue-labelset-editor/style.css";

const labelset = ref<Labelset>({ name: "", desc: "", labels: [], relation_labels: null });

async function save() {
  if (!isValidLabelset(labelset.value)) return;
  await fetch("/api/labelsets", { method: "POST", body: JSON.stringify(labelset.value) });
}
</script>

<template>
  <LabelsetEditor v-model="labelset" />
  <button :disabled="!isValidLabelset(labelset)" @click="save">Save</button>
</template>
```

The component stores nothing and sends nothing. It edits the labelset it is given
through `v-model` and reports what is wrong with it; the host decides where it goes
and puts its own Save button next to it.

## The labelset

```ts
interface Labelset {
  name: string;
  desc: string;
  labels: { name: string; color: string }[]; // order matters: it sets each label's hotkey
  relation_labels?: string[] | null;         // null: the default set
}
```

`relation_labels` set to `null` means "use the default relation labels"
(`DEFAULT_RELATION_LABELS`, the same eight legal-annotation-kit offers). Customising
them stores the list on the labelset, ready to pass to legal-annotation-kit's
`relationLabels`.

## What it does

- Labels with a colour picker. New labels get the next unused colour from a palette of
  twenty that are easy to tell apart.
- Reordering by dragging, or with the arrow buttons. Each row shows the key that arms
  the label in legal-annotation-kit: 1–9, 0, then a–z.
- **Paste a list**: one label per line, optionally followed by a colour
  (`Obligation #d62728`). Lines that can't be added are shown with the reason.
- **Import JSON** reads a file exported by this component, a whole
  legal-annotation-kit task file (its `labelset`), or a bare array of labels.
  **Export JSON** saves the labelset.
- **Undo all changes** brings back the labelset as it was when the editor opened.
- Problems are shown next to the field or row they concern, as you type.

## Props

| Prop | Default | |
|---|---|---|
| `v-model` | required | The `Labelset` being edited. |
| `locked` | `false` | For a labelset already in use: labels can be recoloured and reordered, but not added, removed or renamed; relation labels are fixed. |
| `lockedMessage` | a sentence | Shown above the labels when locked. |
| `withRelationLabels` | `true` | Show the relation labels section. |
| `requireDescription` | `true` | Whether an empty description counts as a problem. |
| `hotkey` | 1–9, 0, a–z | `(index) => string`, the key shown per label. `null` hides the keys. |

Events: `issues` with the current list of problems, every time it changes.

## Rules

A name — of the labelset, a label or a relation label — is required, has no leading or
trailing spaces or repeated spaces, is at most 60 characters, and uses letters and
digits in any script plus `- _ ' ( ) & / .`. Label names and relation label names are
unique, ignoring case. Colours are `#rrggbb`.

## Without Vue

The rules and helpers are also published on their own, for a server checking what it
receives:

```ts
import { validateLabelset } from "vue-labelset-editor/model";

const issues = validateLabelset(body); // [] when valid
```

Also exported: `nameProblem`, `nextColor`, `PALETTE`, `parseLabelList`,
`labelsetToJson`, `labelsetFromJson`, `DEFAULT_RELATION_LABELS`.

## Development

```bash
pnpm install
pnpm dev      # demo page
pnpm test     # vitest
pnpm build
```

## License

MIT
