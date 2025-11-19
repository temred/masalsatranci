export enum PlayerColor {
  WHITE = 'w',
  BLACK = 'b'
}

export interface Move {
  from: string;
  to: string;
  promotion?: string;
}

export interface Square {
  square: string;
  type: string;
  color: PlayerColor;
}

export interface GameState {
  fen: string;
  isGameOver: boolean;
  turn: PlayerColor;
  history: string[];
  lastMove: Move | null;
  inCheck: boolean;
  winner: PlayerColor | 'draw' | null;
}

export interface AiResponse {
  from: string;
  to: string;
  message: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  AI_THINKING = 'AI_THINKING',
  GAME_OVER = 'GAME_OVER'
}
