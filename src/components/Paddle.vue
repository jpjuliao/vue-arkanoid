<template>
  <div 
    v-if="paddle"
    ref="paddle"
    class="paddle"
    :style="{ left: paddle.x + 'px', top: paddle.y + 'px', width: paddle.width + 'px', height: paddle.height + 'px', backgroundColor: paddle.color }"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PaddleProps } from '../types';

export default defineComponent({
  props: {
    paddle: Object as () => PaddleProps,
  },
  setup() {
    // Remove this line since we don't need to declare a reactive ref anymore
    // const paddleRef = ref<HTMLDivElement | null>(null);

    return {
      // No need to return paddleRef anymore
    };
  }
});
</script>

<style scoped>
.paddle {
  position: absolute;
}
</style>
