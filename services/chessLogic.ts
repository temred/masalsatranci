import { Chess } from 'https://esm.sh/chess.js@1.0.0-beta.8';
import { Move } from '../types';

// We instantiate a new Chess object for utility, but we will re-create it 
// inside the component state to ensure immutability and re-renders.

export const getLegalMoves = (fen: string): string[] => {
  const game = new Chess(fen);
  return game.moves({ verbose: true }).map((m: any) => m.from + m.to + (m.promotion || ''));
};

export const makeMove = (fen: string, move: Move): string | null => {
  try {
    const game = new Chess(fen);
    const result = game.move(move);
    if (result) {
      return game.fen();
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const isCheckmate = (fen: string): boolean => {
  const game = new Chess(fen);
  return game.isCheckmate();
};

export const isDraw = (fen: string): boolean => {
  const game = new Chess(fen);
  return game.isDraw();
};

export const isCheck = (fen: string): boolean => {
  const game = new Chess(fen);
  return game.isCheck();
};

export const getValidMovesForSquare = (fen: string, square: string): string[] => {
  const game = new Chess(fen);
  const moves = game.moves({ square: square as any, verbose: true });
  return moves.map((m: any) => m.to);
};

export const getPieceAt = (fen: string, square: string) => {
    const game = new Chess(fen);
    return game.get(square as any);
}
