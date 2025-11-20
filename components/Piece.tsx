import React from 'react';
import { PlayerColor } from '../types';

interface PieceProps {
  type: string; // p, n, b, r, q, k
  color: PlayerColor;
}

export const Piece: React.FC<PieceProps> = ({ type, color }) => {
  
  const isWhite = color === PlayerColor.WHITE;
  const pieceType = type.toLowerCase();

  // --- SVG ÇİZİMLERİ (Inline SVG) ---
  // Bu yöntemle dosya yolu hatası olmaz ve her cihazda aynı görünür.
  
  const getPieceIcon = () => {
    // Ortak stil özellikleri
    const strokeColor = isWhite ? '#1e293b' : '#f8fafc'; // Beyaz taşın kenarı koyu, siyah taşın kenarı açık
    const fillColor = isWhite ? '#ffffff' : '#1e293b';   // Beyaz taş içi beyaz, siyah taş içi koyu
    const strokeWidth = '1.5';

    switch (pieceType) {
      case 'p': // Pawn (Piyon)
        return (
          <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
            <path 
              d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
              fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}
            />
          </svg>
        );
      case 'r': // Rook (Kale)
        return (
          <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
            <g fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" />
              <path d="M34 14l-3 3H14l-3-3" />
              <path d="M31 17v12.5H14V17" />
              <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
              <path d="M11 14h23" fill="none" />
            </g>
          </svg>
        );
      case 'n': // Knight (At)
        return (
          <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
            <g fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} fillRule="evenodd">
              <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
              <path d="M24 18c.38 2.32-2.58 2.9-3 2.5-1.75-1.62-1-3.5 0-4.5 1.16-1.16.62-2.37.37-3.37" />
            </g>
          </svg>
        );
      case 'b': // Bishop (Fil)
        return (
          <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
            <g fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.39 0 10.11.48 13.5 1.45V39H9v-3z" />
              <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
              <path d="M17.5 26h10M15 30h15M22.5 15.5v5M20 18h5" fill="none" />
            </g>
          </svg>
        );
      case 'q': // Queen (Vezir)
        return (
          <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
            <g fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM38.5 20.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" />
              <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-5.5-13.5V25l-7-11-2 12zM9 26c0 2 1.5 2 2.5 4 1 2.5 12.5 2.5 13.5 2.5 1 0 16.5-2.5 13.5-2.5 2.5-2.5 2.5-2.5 2.5-4" />
              <path d="M11 30c0 1.5-1.5 2.5-2 4-1.5 4.5 13 6 13.5 6 .5 0 15-1.5 13.5-6 .5-1.5-2-2.5-2-4" />
            </g>
          </svg>
        );
      case 'k': // King (Şah)
        return (
          <svg viewBox="0 0 45 45" className="w-full h-full drop-shadow-sm">
            <g fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.5 11.63V6M20 8h5" />
              <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" />
              <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 2-8 2s-4-1-4-1v-5h-5v5s0 0-4 1-4-3-8-2c-3 6 6 10.5 6 10.5v7" />
              <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0" />
            </g>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="w-full h-full flex items-center justify-center select-none cursor-pointer p-[10%]"
      draggable={false}
    >
      <div className="w-full h-full transition-transform duration-200 hover:scale-110">
        {getPieceIcon()}
      </div>
    </div>
  );
};
