<script setup lang="ts">
defineProps<{
  name: string;
  desc: string;
  nameProblem?: string;
  descProblem?: string;
  requireDescription: boolean;
}>();
const emit = defineEmits<{ "update:name": [value: string]; "update:desc": [value: string] }>();
</script>

<template>
  <div class="lse-details">
    <label class="lse-field">
      <span class="lse-field__label">Name</span>
      <input
        class="lse-input"
        :value="name"
        placeholder="e.g. Contract clauses"
        :aria-invalid="!!nameProblem"
        data-test="labelset-name"
        @input="emit('update:name', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="nameProblem" class="lse-problem">{{ nameProblem }}</span>
    </label>
    <label class="lse-field">
      <span class="lse-field__label">Description<template v-if="!requireDescription"> (optional)</template></span>
      <textarea
        class="lse-input"
        rows="2"
        :value="desc"
        placeholder="What these labels are for"
        :aria-invalid="!!descProblem"
        data-test="labelset-description"
        @input="emit('update:desc', ($event.target as HTMLTextAreaElement).value)"
      />
      <span v-if="descProblem" class="lse-problem">{{ descProblem }}</span>
    </label>
  </div>
</template>
