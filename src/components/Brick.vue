<template>
  <div v-if="brick" :style="{ left: brick.x + 'px', top: brick.y + 'px', width: brick.width + 'px', height: brick.height + 'px', backgroundColor: brick.color }"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BrickProps } from '../types';

export default defineComponent({
  props: {
    brick: Object as () => BrickProps | undefined
  }
});
</script>
