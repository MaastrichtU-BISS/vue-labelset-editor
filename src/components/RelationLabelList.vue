<script setup lang="ts">
import { computed, ref } from "vue";
import { moved } from "../model/move";
import { nameProblem, sameName } from "../model/names";
import { DEFAULT_RELATION_LABELS } from "../model/relationLabels";

const props = defineProps<{
  relationLabels: string[] | null | undefined;
  problems: Record<number, string>;
  locked?: boolean;
}>();
const emit = defineEmits<{ "update:relationLabels": [value: string[] | null] }>();

const custom = computed(() => props.relationLabels != null);
const shown = computed(() => props.relationLabels ?? DEFAULT_RELATION_LABELS);

const newName = ref("");
const touched = ref(false);
const newProblem = computed(() => {
  const name = newName.value.trim();
  return nameProblem(name) ?? (shown.value.some((n) => sameName(n, name)) ? "Already in the list" : null);
});

const set = (value: string[]) => emit("update:relationLabels", value);
const add = () => {
  touched.value = true;
  if (newProblem.value) return;
  set([...shown.value, newName.value.trim()]);
  newName.value = "";
  touched.value = false;
};
</script>

<template>
  <div class="lse-relations">
    <p class="lse-hint">
      <template v-if="custom">This labelset uses its own relation labels.</template>
      <template v-else>Using the default relation labels.</template>
      <button
        v-if="!locked"
        type="button"
        class="lse-link"
        @click="emit('update:relationLabels', custom ? null : [...DEFAULT_RELATION_LABELS])"
      >
        {{ custom ? "Go back to the defaults" : "Customize" }}
      </button>
    </p>

    <ul v-if="!custom" class="lse-chips">
      <li v-for="name in shown" :key="name" class="lse-chip">{{ name }}</li>
    </ul>

    <template v-else>
      <ol class="lse-list">
        <li v-for="(name, i) in shown" :key="i" class="lse-row" :class="{ 'has-problem': problems[i] }">
          <input
            class="lse-input lse-row__name"
            :value="name"
            :readonly="locked"
            :aria-label="`Relation label ${i + 1}`"
            data-test="relation-label"
            :aria-invalid="!!problems[i]"
            @input="set(shown.map((n, j) => (j === i ? ($event.target as HTMLInputElement).value : n)))"
          />
          <span class="lse-row__actions">
            <button type="button" class="lse-icon" :disabled="i === 0" title="Move up" @click="set(moved(shown, i, i - 1))">↑</button>
            <button type="button" class="lse-icon" :disabled="i === shown.length - 1" title="Move down" @click="set(moved(shown, i, i + 1))">↓</button>
            <button v-if="!locked" type="button" class="lse-icon lse-icon--danger" title="Remove relation label" @click="set(shown.filter((_, j) => j !== i))">✕</button>
          </span>
          <p v-if="problems[i]" class="lse-problem lse-row__problem">{{ problems[i] }}</p>
        </li>
      </ol>
      <form v-if="!locked" class="lse-add" @submit.prevent="add">
        <input
          v-model="newName"
          class="lse-input lse-add__name"
          placeholder="New relation label"
          aria-label="New relation label"
          data-test="relation-label-name"
          @input="touched = false"
        />
        <button type="submit" class="lse-button" data-test="add-relation-label">Add</button>
        <p v-if="touched && newProblem" class="lse-problem lse-add__problem">{{ newProblem }}</p>
      </form>
    </template>
  </div>
</template>
