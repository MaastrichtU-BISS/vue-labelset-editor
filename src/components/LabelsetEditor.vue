<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { defaultHotkey } from "../model/hotkeys";
import type { Issue, Labelset } from "../model/types";
import { validateLabelset } from "../model/validate";
import DetailsFields from "./DetailsFields.vue";
import LabelList from "./LabelList.vue";
import BulkAddPanel from "./BulkAddPanel.vue";
import RelationLabelList from "./RelationLabelList.vue";
import TransferButtons from "./TransferButtons.vue";
import "../styles.css";

const props = withDefaults(
  defineProps<{
    /** Labels can still be recoloured and reordered, but not added, removed or renamed. */
    locked?: boolean;
    lockedMessage?: string;
    withRelationLabels?: boolean;
    requireDescription?: boolean;
    /** The key that arms the label at an index in the annotator; null hides the keys. */
    hotkey?: ((index: number) => string) | null;
  }>(),
  {
    locked: false,
    lockedMessage: "These labels are already in use, so they can be recoloured and reordered but not added, removed or renamed.",
    withRelationLabels: true,
    requireDescription: true,
    hotkey: () => defaultHotkey,
  },
);

const labelset = defineModel<Labelset>({ required: true });
const emit = defineEmits<{ issues: [issues: Issue[]] }>();

const issues = computed(() =>
  validateLabelset(
    props.withRelationLabels ? labelset.value : { ...labelset.value, relation_labels: null },
    { requireDescription: props.requireDescription },
  ),
);
watch(issues, (value) => emit("issues", value), { immediate: true });

const issueFor = (field: Issue["field"]) => issues.value.find((i) => i.field === field)?.message;
const rowIssues = (field: Issue["field"]) =>
  Object.fromEntries(issues.value.filter((i) => i.field === field).map((i) => [i.index!, i.message]));

const original = JSON.stringify(labelset.value);
const changed = computed(() => JSON.stringify(labelset.value) !== original);
const reset = () => (labelset.value = JSON.parse(original));

const update = (patch: Partial<Labelset>) => (labelset.value = { ...labelset.value, ...patch });
const showBulk = ref(false);

const importLabelset = (imported: Labelset) =>
  update({
    name: imported.name || labelset.value.name,
    desc: imported.desc || labelset.value.desc,
    labels: imported.labels,
    ...(props.withRelationLabels ? { relation_labels: imported.relation_labels } : {}),
  });
</script>

<template>
  <div class="lse">
    <DetailsFields
      :name="labelset.name"
      :desc="labelset.desc"
      :name-problem="issueFor('name')"
      :desc-problem="issueFor('desc')"
      :require-description="requireDescription"
      @update:name="(name) => update({ name })"
      @update:desc="(desc) => update({ desc })"
    />

    <p v-if="locked" class="lse-notice" role="note">{{ lockedMessage }}</p>

    <section class="lse-section">
      <header class="lse-section__head">
        <h3 class="lse-section__title">Labels <span class="lse-count">{{ labelset.labels.length }}</span></h3>
        <span class="lse-section__tools">
          <button v-if="!locked" type="button" class="lse-button lse-button--quiet" @click="showBulk = !showBulk">
            Paste a list
          </button>
          <TransferButtons :labelset="labelset" :can-import="!locked" @import="importLabelset" />
          <button v-if="changed" type="button" class="lse-button lse-button--quiet" @click="reset">Undo all changes</button>
        </span>
      </header>
      <p v-if="hotkey && labelset.labels.length" class="lse-hint">
        The order sets each label's key in the annotator, shown on the left. Drag or use the arrows to reorder.
      </p>
      <BulkAddPanel
        v-if="showBulk && !locked"
        :existing="labelset.labels"
        @add="(labels) => update({ labels: [...labelset.labels, ...labels] })"
        @close="showBulk = false"
      />
      <LabelList
        :labels="labelset.labels"
        :problems="rowIssues('label')"
        :hotkey="hotkey"
        :locked="locked"
        @update:labels="(labels) => update({ labels })"
      />
      <p v-if="issueFor('labels')" class="lse-problem">{{ issueFor("labels") }}</p>
    </section>

    <section v-if="withRelationLabels" class="lse-section">
      <header class="lse-section__head">
        <h3 class="lse-section__title">Relation labels</h3>
      </header>
      <RelationLabelList
        :relation-labels="labelset.relation_labels"
        :problems="rowIssues('relation_label')"
        :locked="locked"
        @update:relation-labels="(relation_labels) => update({ relation_labels })"
      />
    </section>
  </div>
</template>
