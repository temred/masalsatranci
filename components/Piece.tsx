import React from 'react';
import { PlayerColor } from '../types';

interface PieceProps {
  type: string; // p, n, b, r, q, k
  color: PlayerColor;
}

export const Piece: React.FC<PieceProps> = ({ type, color }) => {
  
  const symbols: Record<string, string> = {
    p: '♟',
    r: '♜',
    n: '♞',
    b: '♝',
    q: '♛',
    k: '♚',
  };

  const symbol = symbols[type.toLowerCase()] || '';

  const isWhite = color === PlayerColor.WHITE;
  
  // CSS Text Stroke (kontür) ve gölgelendirme ile görünürlük ayarları
  const colorStyle: React.CSSProperties = isWhite 
    ? { 
        color: '#FFFFFF', 
        // Beyaz taşlar için koyu gri kontür ve hafif 3D efekti
        textShadow: '0 2px 0 #cbd5e1',
        WebkitTextStroke: '1.5px #475569', // Slate-600 kontür
        paintOrder: 'stroke fill'
      } 
    : { 
        color: '#4C1D95', // Koyu mor
        textShadow: '0 2px 0 #DDD6FE' // Açık mor gölge
      };

  return (
    <div 
      className="w-full h-full flex items-center justify-center select-none cursor-pointer leading-none"
      style={colorStyle}
    >
      {/* Font boyutunu küçülttük ve responsive yaptık (text-3xl sm:text-4xl). 
          leading-none satır yüksekliğinin kareyi itmesini engeller. */}
      <span className="text-3xl sm:text-4xl md:text-5xl drop-shadow-sm transition-transform hover:scale-110">
        {symbol}
      </span>
    </div>
  );
};