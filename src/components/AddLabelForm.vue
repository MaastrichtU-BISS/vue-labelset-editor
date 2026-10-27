<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { nameProblem, sameName } from "../model/names";
import type { Label } from "../model/types";

const props = defineProps<{ existingNames: string[]; suggestedColor: string }>();
const emit = defineEmits<{ add: [label: Label] }>();

const name = ref("");
const color = ref(props.suggestedColor);
const touched = ref(false);

watch(
  () => props.suggestedColor,
  (next) => (color.value = next),
);

const problem = computed(() => {
  const trimmed = name.value.trim();
  return (
    nameProblem(trimmed) ??
    (props.existingNames.some((n) => sameName(n, trimmed)) ? "A label with this name already exists" : null)
  );
});

const submit = () => {
  touched.value = true;
  if (problem.value) return;
  emit("add", { name: name.value.trim(), color: color.value });
  name.value = "";
  touched.value = false;
};
</script>

<template>
  <form class="lse-add" @submit.prevent="submit">
    <input v-model="color" class="lse-row__color" type="color" aria-label="Colour of the new label" />
    <input
      v-model="name"
      class="lse-input lse-add__name"
      placeholder="New label name"
      aria-label="New label name"
      data-test="label-name"
      :aria-invalid="touched && !!problem"
      @input="touched = false"
    />
    <button type="submit" class="lse-button" data-test="add-label">Add label</button>
    <p v-if="touched && problem" class="lse-problem lse-add__problem">{{ problem }}</p>
  </form>
</template>
