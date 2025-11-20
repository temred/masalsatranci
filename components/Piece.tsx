// Piece.tsx – Tüm taşlar eşit boyutta olacak şekilde düzeltilmiş
import React from 'react';
import { PlayerColor } from '../types';

const pieceSymbols: Record<string, string> = {
  k: '♔',
  q: '♕',
  r: '♖',
  b: '♗',
  n: '♘',
  p: '♙',

  K: '♚',
  Q: '♛',
  R: '♜',
  B: '♝',
  N: '♞',
  P: '♟',
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
        fontFamily: '"Noto Sans Symbols2", "Segoe UI Symbol", sans-serif', // 🔥 EŞİT BOYUT SİHRİ
        fontSize: 'clamp(48px, 10vw, 80px)',
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
