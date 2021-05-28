import { ref, toRef, toRefs, reactive } from "vue";

export default function useData() {
  const a = ref(0);
  const b = reactive({
    a: 1,
    b: 2,
  });
  return {};
}
