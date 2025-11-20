import React from 'react';
import { PlayerColor } from '../types';

interface PieceProps {
  type: string; // "p", "r", "n", "b", "q", "k"
  color: PlayerColor;
  size?: string | number;
}

const pieceMap: Record<'white' | 'black', Record<string, string>> = {
  white: {
    p: '/pieces/pawn-w.svg',
    r: '/pieces/rook-w.svg',
    n: '/pieces/knight-w.svg',
    b: '/pieces/bishop-w.svg',
    q: '/pieces/queen-w.svg',
    k: '/pieces/king-w.svg',
  },
  black: {
    p: '/pieces/pawn-b.svg',
    r: '/pieces/rook-b.svg',
    n: '/pieces/knight-b.svg',
    b: '/pieces/bishop-b.svg',
    q: '/pieces/queen-b.svg',
    k: '/pieces/king-b.svg',
  }
};

export const Piece: React.FC<PieceProps> = ({ type, color, size = '90%' }) => {
  const col = color === PlayerColor.WHITE ? 'white' : 'black';
  const key = type.toLowerCase();
  const src = pieceMap[col][key];

  if (!src) return null;

  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <img
        src={src}
        alt={`${col} ${key}`}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          objectFit: 'contain',
          display: 'block',
          pointerEvents: 'none'
        }}
        draggable={false}
      />
    </div>
  );
};
