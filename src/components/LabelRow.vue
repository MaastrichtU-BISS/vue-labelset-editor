<script setup lang="ts">
import type { Label } from "../model/types";

defineProps<{
  label: Label;
  index: number;
  count: number;
  hotkey: string;
  problem?: string;
  locked?: boolean;
  dragging?: boolean;
  dropTarget?: boolean;
}>();

const emit = defineEmits<{
  update: [label: Label];
  remove: [];
  move: [to: number];
  dragstart: [event: DragEvent];
  dragenter: [];
  drop: [];
  dragend: [];
}>();
</script>

<template>
  <li
    class="lse-row"
    :class="{ 'is-dragging': dragging, 'is-drop-target': dropTarget, 'has-problem': problem }"
    @dragenter.prevent="emit('dragenter')"
    @dragover.prevent
    @drop.prevent="emit('drop')"
  >
    <span
      class="lse-row__handle"
      draggable="true"
      title="Drag to reorder"
      aria-hidden="true"
      @dragstart="emit('dragstart', $event)"
      @dragend="emit('dragend')"
      >⠿</span
    >
    <kbd v-if="hotkey" class="lse-row__key" :title="`Arms this label in the annotator`">{{ hotkey.toUpperCase() }}</kbd>
    <span v-else class="lse-row__key lse-row__key--none" title="No hotkey: past the 36th label">–</span>
    <input
      class="lse-row__color"
      type="color"
      :value="label.color"
      :aria-label="`Colour of ${label.name}`"
      @input="emit('update', { ...label, color: ($event.target as HTMLInputElement).value })"
    />
    <input
      class="lse-input lse-row__name"
      :value="label.name"
      :readonly="locked"
      :aria-label="`Label ${index + 1} name`"
      :aria-invalid="!!problem"
      :style="{ '--lse-label-color': label.color }"
      @input="emit('update', { ...label, name: ($event.target as HTMLInputElement).value })"
    />
    <span class="lse-row__actions">
      <button type="button" class="lse-icon" :disabled="index === 0" title="Move up" @click="emit('move', index - 1)">↑</button>
      <button type="button" class="lse-icon" :disabled="index === count - 1" title="Move down" @click="emit('move', index + 1)">↓</button>
      <button v-if="!locked" type="button" class="lse-icon lse-icon--danger" title="Remove label" @click="emit('remove')">✕</button>
    </span>
    <p v-if="problem" class="lse-problem lse-row__problem">{{ problem }}</p>
  </li>
</template>
