import React from 'react';
import { PlayerColor } from '../types';

// Beyaz ve siyah taşlar için ayrı SVG import edeceğiz
import WhitePawn from './pieces/WhitePawn.svg';
import WhiteRook from './pieces/WhiteRook.svg';
import WhiteKnight from './pieces/WhiteKnight.svg';
import WhiteBishop from './pieces/WhiteBishop.svg';
import WhiteQueen from './pieces/WhiteQueen.svg';
import WhiteKing from './pieces/WhiteKing.svg';

import BlackPawn from './pieces/BlackPawn.svg';
import BlackRook from './pieces/BlackRook.svg';
import BlackKnight from './pieces/BlackKnight.svg';
import BlackBishop from './pieces/BlackBishop.svg';
import BlackQueen from './pieces/BlackQueen.svg';
import BlackKing from './pieces/BlackKing.svg';

interface PieceProps {
  type: string; // 'p', 'n', 'b', 'r', 'q', 'k'
  color: PlayerColor;
}

const pieceMap: Record<string, Record<PlayerColor, any>> = {
  p: { w: WhitePawn, b: BlackPawn },
  r: { w: WhiteRook, b: BlackRook },
  n: { w: WhiteKnight, b: BlackKnight },
  b: { w: WhiteBishop, b: BlackBishop },
  q: { w: WhiteQueen, b: BlackQueen },
  k: { w: WhiteKing, b: BlackKing },
};

export const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const SvgComponent = pieceMap[type.toLowerCase()]?.[color];

  if (!SvgComponent) {
    return null; // boş kare
  }

  return (
    <div className="w-full h-full flex items-center justify-center select-none cursor-pointer">
      <img
        src={SvgComponent}
        alt={`${color === 'w' ? 'Beyaz' : 'Siyah'} ${type.toUpperCase()}`}
        className="w-[85%] h-[85%] object-contain drop-shadow-lg 
                   transition-all duration-200 hover:scale-110 
                   active:scale-95"
        draggable={false}
      />
    </div>
  );
};
