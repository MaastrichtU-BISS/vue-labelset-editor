<script setup lang="ts">
import { computed } from "vue";
import { nextColor } from "../model/colors";
import { moved } from "../model/move";
import type { Label } from "../model/types";
import { useDragReorder } from "../composables/useDragReorder";
import LabelRow from "./LabelRow.vue";
import AddLabelForm from "./AddLabelForm.vue";

const props = defineProps<{
  labels: Label[];
  problems: Record<number, string>;
  hotkey: ((index: number) => string) | null;
  locked?: boolean;
}>();
const emit = defineEmits<{ "update:labels": [labels: Label[]] }>();

const names = computed(() => props.labels.map((l) => l.name));
const suggestedColor = computed(() => nextColor(props.labels.map((l) => l.color)));

const set = (labels: Label[]) => emit("update:labels", labels);
const move = (from: number, to: number) => set(moved(props.labels, from, to));
const drag = useDragReorder(move);
</script>

<template>
  <div class="lse-labels">
    <ol v-if="labels.length" class="lse-list">
      <LabelRow
        v-for="(label, i) in labels"
        :key="i"
        :label="label"
        :index="i"
        :count="labels.length"
        :hotkey="hotkey ? hotkey(i) : ''"
        :problem="problems[i]"
        :locked="locked"
        :dragging="drag.dragging.value === i"
        :drop-target="drag.over.value === i && drag.dragging.value !== i"
        @update="(next) => set(labels.map((l, j) => (j === i ? next : l)))"
        @remove="set(labels.filter((_, j) => j !== i))"
        @move="(to) => move(i, to)"
        @dragstart="(e) => drag.start(i, e)"
        @dragenter="drag.enter(i)"
        @drop="drag.drop(i)"
        @dragend="drag.end()"
      />
    </ol>
    <p v-else class="lse-empty">No labels yet. Add one below, or paste a list.</p>
    <AddLabelForm
      v-if="!locked"
      :existing-names="names"
      :suggested-color="suggestedColor"
      @add="(label) => set([...labels, label])"
    />
  </div>
</template>
