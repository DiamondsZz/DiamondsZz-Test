<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRef, toRefs, reactive } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
  },
  setup() {
    const a = ref(0);
    const b = reactive({
      a: 1,
      b: 2,
    });
    const c = toRef(b, "a");
    const d = { a: 3 };
    const e = toRef(d, "a");

    d.a++;
    console.log(e.value);
  },
});
</script>
