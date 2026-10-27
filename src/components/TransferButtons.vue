<script setup lang="ts">
import { ref } from "vue";
import { labelsetFromJson, labelsetToJson } from "../model/json";
import type { Labelset } from "../model/types";

const props = defineProps<{ labelset: Labelset; canImport: boolean }>();
const emit = defineEmits<{ import: [labelset: Labelset] }>();

const picker = ref<HTMLInputElement | null>(null);
const error = ref("");

const fileName = () =>
  `${(props.labelset.name.trim() || "labelset").replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.labelset.json`;

const exportJson = () => {
  const url = URL.createObjectURL(new Blob([labelsetToJson(props.labelset)], { type: "application/json" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: fileName() });
  link.click();
  URL.revokeObjectURL(url);
};

const importJson = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;
  error.value = "";
  try {
    emit("import", labelsetFromJson(await file.text()));
  } catch (e) {
    error.value = `${file.name}: ${e instanceof Error ? e.message : "could not be read"}`;
  }
};
</script>

<template>
  <span class="lse-transfer">
    <button v-if="canImport" type="button" class="lse-button lse-button--quiet" @click="picker?.click()">Import JSON</button>
    <button type="button" class="lse-button lse-button--quiet" :disabled="!labelset.labels.length" @click="exportJson">
      Export JSON
    </button>
    <input ref="picker" type="file" accept=".json,application/json" hidden @change="importJson" />
    <span v-if="error" class="lse-problem">{{ error }}</span>
  </span>
</template>
