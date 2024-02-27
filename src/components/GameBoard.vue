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

    // Define reactive state for bricks
    const bricks = reactive<BrickProps[]>([]);

    // Function to handle keyboard key press for paddle movement
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        if (paddlePosition.x > 0) {
          paddlePosition.x -= 20;
        }
      } else if (event.key === 'ArrowRight') {
        const gameBoardWidth = (document.querySelector('.game-board') as HTMLElement).offsetWidth;
        if (paddlePosition.x < gameBoardWidth - paddlePosition.width) {
          paddlePosition.x += 20;
        }
      }
    };

    // Function to handle mouse movement for paddle movement
    const handleMouseMove = (event: MouseEvent) => {
      const gameBoardRect = (document.querySelector('.game-board') as HTMLElement).getBoundingClientRect();
      const mouseX = event.clientX - gameBoardRect.left;
      const paddleWidth = paddlePosition.width;
      if (mouseX >= paddleWidth / 2 && mouseX <= gameBoardRect.width - paddleWidth / 2) {
        paddlePosition.x = mouseX - paddleWidth / 2; // Adjust paddle position to center around the mouse pointer
      }
    };

    // Function to update ball position and handle collisions
    const updateBallPosition = () => {
      // Update ball position based on velocity
      ballState.x += velocity.x;
      ballState.y += velocity.y;

      // Check for collision with walls
      if (ballState.x + ballState.radius >= window.innerWidth || ballState.x - ballState.radius <= 0) {
        velocity.x *= -1; // Reverse velocity on collision with side walls
      }
      if (ballState.y - ballState.radius <= 0) {
        velocity.y *= -1; // Reverse velocity on collision with top wall
      } else if (ballState.y + ballState.radius >= window.innerHeight) {
        // Reset ball position if it collides with bottom wall (game over logic can be added here)
        ballState.x = 50;
        ballState.y = 50;
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
        // Ball collided with paddle

        // Reverse ball's vertical velocity
        velocity.y *= -1;

        // Adjust ball's horizontal velocity based on collision point with paddle
        const collisionPoint = ballState.x - paddlePosition.x;
        const normalizedCollisionPoint = collisionPoint / paddlePosition.width;
        const angle = normalizedCollisionPoint * Math.PI - Math.PI / 2; // Calculate angle in radians
        velocity.x = Math.sin(angle) * 5; // Adjust velocity based on angle of collision
      }

      // Check for collision with bricks
      for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        const brickBox = {
          left: brick.x,
          right: brick.x + brick.width,
          top: brick.y,
          bottom: brick.y + brick.height,
        };
        if (
          ballBox.right > brickBox.left &&
          ballBox.left < brickBox.right &&
          ballBox.bottom > brickBox.top &&
          ballBox.top < brickBox.bottom
        ) {
          // Ball collided with brick, remove the brick from the array
          bricks.splice(i, 1);

          // Reverse ball velocity on collision with brick
          velocity.y *= -1;

          // Break the loop after collision with one brick to avoid unnecessary checks
          break;
        }
      }
    };

    // Function to initialize bricks
    const initBricks = () => {
      const brickWidth = 80;
      const brickHeight = 20;
      const numRows = 3;
      const numCols = Math.floor(window.innerWidth / (brickWidth + 10)); // Adjusted for gap

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          const brick: BrickProps = {
            x: j * (brickWidth + 10), // Adjusted for gap
            y: i * (brickHeight + 10), // Adjusted for gap
            width: brickWidth,
            height: brickHeight,
            color: "green",
          };
          bricks.push(brick);
        }
      }
    };

    // Add event listener for key press when component is mounted
    onMounted(() => {
      window.addEventListener('keydown', handleKeyPress);
      // Start updating ball position at regular intervals
      setInterval(updateBallPosition, 1000 / 60); // Update ball position at 60 FPS
      window.addEventListener('mousemove', handleMouseMove);

      // Set the initial x position of the paddle to center it horizontally
      const gameBoardWidth = (document.querySelector('.game-board') as HTMLElement).offsetWidth;
      paddlePosition.x = (gameBoardWidth - paddlePosition.width) / 2;

      // Set the initial y position of the paddle to place it at the bottom
      const gameBoardHeight = (document.querySelector('.game-board') as HTMLElement).offsetHeight;
      paddlePosition.y = gameBoardHeight - paddlePosition.height - 30;

      // Initialize bricks
      initBricks();
    });

    // Remove event listener when component is unmounted
    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyPress);
      window.addEventListener('mousemove', handleMouseMove);
    });

    return {
      paddle: paddlePosition,
      ball: ballState,
      bricks,
    };
  },
});
</script>

<style scoped>
.game-board {
  position: relative;
  width: 100vw;
  /* Set game board width to viewport width */
  height: 100vh;
  /* Set game board height to viewport height */
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
