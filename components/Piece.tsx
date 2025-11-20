import React from 'react';
import { PlayerColor } from '../types';

interface PieceProps {
  type: string; // p, n, b, r, q, k (küçük harf)
  color: PlayerColor; // w veya b
}

export const Piece: React.FC<PieceProps> = ({ type, color }) => {
  
  // Kodunuzdaki parça tiplerini (k, q, r...) SİZİN SVG dosya isimlerinizle eşleştiriyoruz.
  const pieceNameMap: Record<string, string> = {
    'p': 'pawn',    // piyon
    'n': 'knight',  // at
    'b': 'bishop',  // fil
    'r': 'rook',    // kale
    'q': 'queen',   // vezir
    'k': 'king',    // şah
  };

  const pieceName = pieceNameMap[type.toLowerCase()]; // örn: 'k' -> 'king'
  
  if (!pieceName) {
    // Parça tipi bulunamazsa (örneğin boş kare)
    return null;
  }

  // Dosya formatını oluşturuyoruz: örn. king-w.svg
  // (Sizin dosya isimleriniz tam olarak "king-w.svg" formatında olduğu için bu kodu kullanıyoruz)
  const pieceCode = `${pieceName}-${color}`; 
  
  // Resmin yolunu belirtiyoruz. Bu yol, public/pieces/ klasörüne gider.
  const imageUrl = `/pieces/${pieceCode}.svg`; 

  return (
    <div 
      // Eski text-shadow/kontür stillerini kaldırdık, çünkü artık resim kullanıyoruz.
      className="w-full h-full flex items-center justify-center select-none cursor-pointer leading-none"
    >
      <img 
        src={imageUrl} 
        alt={`${color === 'w' ? 'Beyaz' : 'Siyah'} ${pieceName}`}
        // w-full ve h-full ile taşın karesini tam doldurmasını sağlıyoruz.
        className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-110"
      />
    </div>
  );
};
