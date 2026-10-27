<script setup lang="ts">
import { ref } from "vue";
import LabelsetEditor from "../components/LabelsetEditor.vue";
import type { Issue, Labelset } from "../model/types";

const labelset = ref<Labelset>({
  name: "Contract clauses",
  desc: "Obligations and parties in sales contracts",
  labels: [
    { name: "Obligation", color: "#1f77b4" },
    { name: "Party", color: "#d62728" },
  ],
  relation_labels: null,
});
const locked = ref(false);
const issues = ref<Issue[]>([]);
</script>

<template>
  <main style="max-width: 44rem; margin: 2rem auto; padding: 0 1rem; font-family: system-ui">
    <label><input v-model="locked" type="checkbox" /> Locked (in use by tasks)</label>
    <hr />
    <LabelsetEditor v-model="labelset" :locked="locked" @issues="issues = $event" />
    <hr />
    <p>{{ issues.length ? `${issues.length} issue(s)` : "Valid" }}</p>
    <pre data-test="model">{{ JSON.stringify(labelset, null, 2) }}</pre>
  </main>
</template>
