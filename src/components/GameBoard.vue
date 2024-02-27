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

    // Initialize bricks at the top of the game board
    const bricks: BrickProps[] = [];
    const brickWidth = 60;
    const brickHeight = 20;
    const brickColor = "green";
    const brickRowCount = 3;
    const brickColumnCount = Math.floor(window.innerWidth / brickWidth);
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brickX = c * (brickWidth + 10); // Add spacing between bricks
        const brickY = r * (brickHeight + 10); // Add spacing between bricks
        bricks.push({
          x: brickX,
          y: brickY,
          width: brickWidth,
          height: brickHeight,
          color: brickColor,
        });
      }
    }

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

      // Check for collision with paddle
      const paddleBox = {
        left: paddlePosition.x,
        right: paddlePosition.x + paddlePosition.width,
        top: paddlePosition.y,
        bottom: paddlePosition.y + paddlePosition.height,
      };
      const ballBox = {
        left: ballState.x - ballState.radius,
        right: ballState.x + ballState.radius,
        top: ballState.y - ballState.radius,
        bottom: ballState.y + ballState.radius,
      };
      if (
        ballBox.right > paddleBox.left &&
        ballBox.left < paddleBox.right &&
        ballBox.bottom > paddleBox.top &&
        ballBox.top < paddleBox.bottom
      ) {
        // Ball collided with paddle, reverse its y velocity
        velocity.y *= -1;
      }
    };

    // Add event listener for key press when component is mounted
    onMounted(() => {
      window.addEventListener('keydown', handleKeyPress);
      // Start updating ball position at regular intervals
      setInterval(updateBallPosition, 1000 / 60); // Update ball position at 60 FPS

      // Set the initial x position of the paddle to center it horizontally
      const gameBoardWidth = (document.querySelector('.game-board') as HTMLElement).offsetWidth;
      paddlePosition.x = (gameBoardWidth - paddlePosition.width) / 2;

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
      bricks: bricks,
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
