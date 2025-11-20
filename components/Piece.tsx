// Piece.tsx (YENİ HALİ – iOS’ta mükemmel görünür)
import React from 'react';
import { PlayerColor } from '../types';

const pieceSymbols: Record<string, string> = {
  k: '♔', // beyaz şah
  q: '♕',
  r: '♖',
  b: '♗',
  n: '♘',
  p: '♙', // beyaz piyon
  K: '♚', // siyah
  Q: '♛',
  R: '♜',
  B: '♝',
  N: '♞',
  P: '♟', // siyah piyon
};

export const Piece: React.FC<{ type: string; color: PlayerColor }> = ({ type, color }) => {
  const key = color === PlayerColor.WHITE 
    ? type.toLowerCase() 
    : type.toUpperCase();

  const symbol = pieceSymbols[key] || '';

  return (
    <div 
      className="w-full h-full flex items-center justify-center select-none"
      style={{
        fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif',
        fontSize: 'clamp(48px, 10vw, 80px)',  // responsive ve büyük
        lineHeight: '1',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ transform: 'translateY(2px)' }}>{symbol}</span>
    </div>
  );
};
