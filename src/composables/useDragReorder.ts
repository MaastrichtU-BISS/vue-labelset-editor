import { ref } from "vue";

export function useDragReorder(onMove: (from: number, to: number) => void) {
  const dragging = ref<number | null>(null);
  const over = ref<number | null>(null);

  const start = (index: number, event: DragEvent) => {
    dragging.value = index;
    event.dataTransfer?.setData("text/plain", String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  };
  const enter = (index: number) => {
    if (dragging.value !== null) over.value = index;
  };
  const drop = (index: number) => {
    if (dragging.value !== null) onMove(dragging.value, index);
    end();
  };
  const end = () => {
    dragging.value = null;
    over.value = null;
  };

  return { dragging, over, start, enter, drop, end };
}
