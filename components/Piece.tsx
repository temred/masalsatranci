import React from 'react';
import { PlayerColor } from '../types';

interface PieceProps {
  type: string; // p, n, b, r, q, k
  color: PlayerColor;
}

export const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const isWhite = color === PlayerColor.WHITE;

  // RENK AYARLARI
  // Beyaz: İçi Beyaz, Dışında Koyu Gri Çizgi (Netlik için)
  const whiteStyle = {
    fill: '#FFFFFF',
    stroke: '#334155', // slate-700
    strokeWidth: '1.5',
  };

  // Siyah (Mor): İçi Koyu Mor, ÇİZGİ YOK (Silüet)
  // Bu sayede taşlar "blob" gibi görünmez, net birer gölge gibi durur.
  const blackStyle = {
    fill: '#6b21a8', // purple-800
    stroke: 'none',
    strokeWidth: '0',
  };

  const style = isWhite ? whiteStyle : blackStyle;

  // KLASİK FONT GÖRÜNÜMLÜ ÇİZİMLER (Standard Unicode Shapes)
  // Bu çizimler, yazı tipi karakterlerinin (♟) birebir vektörel kopyasıdır.
  // fillRule="evenodd" çok önemlidir, delikleri (filin ağzı vb.) açar.
  const getPath = () => {
    switch (type.toLowerCase()) {
      case 'p': // Pawn (Piyon)
        return (
          <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
        );
      case 'r': // Rook (Kale)
        return (
          <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5h23V9h4v5H11z" />
        );
      case 'n': // Knight (At)
        return (
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21M24 18c.38 2.32-4.68 3.23-5.62.36.03-2.24 4.36-3.85 5.62-.36z" />
        );
      case 'b': // Bishop (Fil)
        return (
          <g>
            <path d="M22.5 11.63V6M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.39 0 10.11.48 13.5 1.45V30H9v6zm13.5-32c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" />
            <path d="M15 32h15M22.5 5v2.5" stroke={style.stroke === 'none' ? '#9333ea' : style.stroke} strokeWidth={style.stroke === 'none' ? '2' : '1.5'} />
          </g>
        );
      case 'q': // Queen (Vezir)
        return (
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12zM9 26c0 2 1.5 2 2.5 4 0 0 5 2.5 6 5 9.5-1.5 14-1 16-1 2 5 8 4 8 4 1 0 2.5-2 2.5-4l-1-7.5c-4.5-1-9-1-14-1-4.5 0-9 .5-13.5 1.5L9 26zM9 26c0-1.5-1.5-3-3-3s-3 1.5-3 3 1.5 3 3 3 3-1.5 3-3zm33 0c0-1.5-1.5-3-3-3s-3 1.5-3 3 1.5 3 3 3 3-1.5 3-3z" />
        );
      case 'k': // King (Şah)
        return (
          <path d="M22.5 11.63V6M20 8h5M22.5 25s4.5-7.5 3-13.5c-3 6-11.5 6-8.5 13.5M22.5 25c5.5 1 7 3 7 7H15.5c0-4 1.5-6 7-7zM12.5 32h20M11.5 37c5.5 3.5 15.5 3.5 21 0v-5h-21v5z" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center select-none p-[10%] transition-transform hover:scale-110 drop-shadow-md">
      <svg 
        viewBox="0 0 45 45" 
        className="w-full h-full"
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g fillRule="evenodd">
          {getPath()}
        </g>
      </svg>
    </div>
  );
};
