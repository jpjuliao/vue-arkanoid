<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive } from "vue";
import Paddle from "./Paddle.vue";
import Ball from "./Ball.vue";
import Brick from "./Brick.vue";
import { PaddleProps, BallProps } from "../types";

export default defineComponent({
  components: {
    Paddle,
    Ball,
    Brick,
  },
  setup() {
    // Define reactive state for paddle position
    const paddlePosition = reactive<PaddleProps>({
      x: 0,
      y: 0,
      width: 100,
      height: 10,
      color: "blue",
    });

    // Define reactive state for ball position
    const ballState = reactive<BallProps>({
      x: 50,
      y: 50,
      radius: 5,
      color: "red",
    });

    // Define reactive state for ball velocity
    const velocity = reactive<{ x: number; y: number }>({
      x: 5,
      y: 5,
    });

    // Function to handle keyboard key press for paddle movement
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        paddlePosition.x -= 10;
      } else if (event.key === 'ArrowRight') {
        paddlePosition.x += 10;
      }
    };

    // Function to update ball position
    const updateBallPosition = () => {
      // Update ball position based on velocity
      ballState.x += velocity.x;
      ballState.y += velocity.y;

      // Check for collision with walls
      if (ballState.x + ballState.radius >= window.innerWidth || ballState.x - ballState.radius <= 0) {
        velocity.x *= -1; // Reverse velocity on collision with side walls
      }
      if (ballState.y - ballState.radius <= 0 || ballState.y + ballState.radius >= window.innerHeight) {
        velocity.y *= -1; // Reverse velocity on collision with top or bottom walls
      }
    };

    // Add event listener for key press when component is mounted
    onMounted(() => {
      window.addEventListener('keydown', handleKeyPress);
      // Start updating ball position at regular intervals
      setInterval(updateBallPosition, 1000 / 60); // Update ball position at 60 FPS

      // Set the initial y position of the paddle to place it at the bottom
      const gameBoardHeight = (document.querySelector('.game-board') as HTMLElement).offsetHeight;
      paddlePosition.y = gameBoardHeight - paddlePosition.height - 30;
    
    });

    // Remove event listener when component is unmounted
    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyPress);
    });

    return {
      paddle: paddlePosition,
      ball: ballState,
      bricks: [], // Initialize bricks as an empty array for now
    };
  },
});
</script>

<style scoped>
.game-board {
  position: relative;
  width: 100vw; /* Set game board width to viewport width */
  height: 100vh; /* Set game board height to viewport height */
  overflow: hidden;
}
</style>

<template>
  <div ref="gameBoard" class="game-board">
    <Paddle :paddle="paddle" />
    <Ball :ball="ball" />
    <Brick v-for="(brick, index) in bricks" :key="index" :brick="brick" />
  </div>
</template>