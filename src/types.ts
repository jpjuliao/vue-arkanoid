// types.ts
export interface PaddleProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface BallProps {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocityX: number;
  velocityY: number;
}

export interface BrickProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}
