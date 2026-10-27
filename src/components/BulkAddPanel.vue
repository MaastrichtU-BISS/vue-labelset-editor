<script setup lang="ts">
import { computed, ref } from "vue";
import { nextColor } from "../model/colors";
import { parseLabelList } from "../model/parseLabelList";
import type { Label } from "../model/types";

const props = defineProps<{ existing: Label[] }>();
const emit = defineEmits<{ add: [labels: Label[]]; close: [] }>();

const text = ref("");
const lines = computed(() => parseLabelList(text.value, props.existing.map((l) => l.name)));
const addable = computed(() => lines.value.filter((l) => !l.problem));

const add = () => {
  const colors = props.existing.map((l) => l.color);
  const labels = addable.value.map((line) => {
    const color = line.color ?? nextColor(colors);
    colors.push(color);
    return { name: line.name, color };
  });
  emit("add", labels);
  text.value = "";
};
</script>

<template>
  <div class="lse-bulk">
    <label class="lse-field">
      <span class="lse-field__label">Paste labels, one per line. A colour may follow: <code>Obligation #d62728</code></span>
      <textarea v-model="text" class="lse-input" rows="6" placeholder="Obligation&#10;Party&#10;Date #2ca02c" />
    </label>
    <ul v-if="lines.length" class="lse-bulk__preview">
      <li v-for="line in lines" :key="line.line" :class="{ 'is-skipped': line.problem }">
        <span class="lse-swatch" :style="{ background: line.color ?? 'transparent' }" />
        <span class="lse-bulk__name">{{ line.name }}</span>
        <span v-if="line.problem" class="lse-problem">line {{ line.line }}: {{ line.problem }}</span>
      </li>
    </ul>
    <div class="lse-bulk__actions">
      <button type="button" class="lse-button" :disabled="!addable.length" @click="add">
        Add {{ addable.length }} label{{ addable.length === 1 ? "" : "s" }}
      </button>
      <button type="button" class="lse-button lse-button--quiet" @click="emit('close')">Close</button>
    </div>
  </div>
</template>
