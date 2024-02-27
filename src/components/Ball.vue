<template>
  <div 
  v-if="ball"
  class="ball"
  :style="{ left: ball.x + 'px', top: ball.y + 'px', width: ball.radius * 2 + 'px', height: ball.radius * 2 + 'px', borderRadius: '50%', backgroundColor: ball.color }"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BallProps } from '../types'

export default defineComponent({
  props: {
    ball: Object as () => BallProps | undefined
  }
});
</script>

<style scoped>
.ball {
  position: absolute;
}
</style>