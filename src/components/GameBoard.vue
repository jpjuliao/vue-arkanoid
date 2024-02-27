<template>
  <div ref="gameBoard" class="game-board">
    <Paddle :paddle="paddle" />
    <Ball :ball="ball" />
    <div v-for="(brick, index) in bricks" :key="index">
      <Brick :brick="brick" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive } from "vue";
import Paddle from "./Paddle.vue";
import Ball from "./Ball.vue";
import Brick from "./Brick.vue";
import { PaddleProps, BallProps, BrickProps } from "../types";

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

    // Define reactive state for ball position and velocity
    const ballState = reactive<BallProps>({
      x: 50,
      y: 50,
      radius: 5,
      color: "red",
      velocityX: 5,
      velocityY: 5,
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
      ballState.x += ballState.velocityX;
      ballState.y += ballState.velocityY;

      // Check for collision with walls
      if (ballState.x + ballState.radius >= window.innerWidth || ballState.x - ballState.radius <= 0) {
        ballState.velocityX *= -1; // Reverse velocity on collision with side walls
      }
      if (ballState.y - ballState.radius <= 0) {
        ballState.velocityY *= -1; // Reverse velocity on collision with top wall
      }

      // You can add more collision logic here, e.g., collision with paddle or bricks
    };

    // Add event listener for key press when component is mounted
    onMounted(() => {
      window.addEventListener('keydown', handleKeyPress);
      // Start updating ball position at regular intervals
      setInterval(updateBallPosition, 1000 / 60); // Update ball position at 60 FPS
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
}
</style>
