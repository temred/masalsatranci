import React from 'react';
import { PlayerColor } from '../types';

// --- SVG DOSYA IMPORTLARI ---
// Not: Dosya yollarını ('../assets/pieces/...') kendi klasör yapına göre düzenle.
import wP from '../assets/pieces/w_p.svg'; // Beyaz Piyon
import wN from '../assets/pieces/w_n.svg'; // Beyaz At
import wB from '../assets/pieces/w_b.svg'; // Beyaz Fil
import wR from '../assets/pieces/w_r.svg'; // Beyaz Kale
import wQ from '../assets/pieces/w_q.svg'; // Beyaz Vezir
import wK from '../assets/pieces/w_k.svg'; // Beyaz Şah

import bP from '../assets/pieces/b_p.svg'; // Siyah Piyon
import bN from '../assets/pieces/b_n.svg'; // Siyah At
import bB from '../assets/pieces/b_b.svg'; // Siyah Fil
import bR from '../assets/pieces/b_r.svg'; // Siyah Kale
import bQ from '../assets/pieces/b_q.svg'; // Siyah Vezir
import bK from '../assets/pieces/b_k.svg'; // Siyah Şah

interface PieceProps {
  type: string; // p, n, b, r, q, k
  color: PlayerColor;
}

// Taş görsellerini tip ve renge göre eşleştiren tablo
const pieceImages: Record<string, Record<string, string>> = {
  p: { [PlayerColor.WHITE]: wP, [PlayerColor.BLACK]: bP },
  n: { [PlayerColor.WHITE]: wN, [PlayerColor.BLACK]: bN },
  b: { [PlayerColor.WHITE]: wB, [PlayerColor.BLACK]: bB },
  r: { [PlayerColor.WHITE]: wR, [PlayerColor.BLACK]: bR },
  q: { [PlayerColor.WHITE]: wQ, [PlayerColor.BLACK]: bQ },
  k: { [PlayerColor.WHITE]: wK, [PlayerColor.BLACK]: bK },
};

export const Piece: React.FC<PieceProps> = ({ type, color }) => {
  
  // Gelen tipi güvenli hale getir (küçük harfe çevir)
  const lowerType = type.toLowerCase();

  // İlgili görseli bul
  const imageSrc = pieceImages[lowerType]?.[color];

  // Eğer görsel bulunamazsa (hatalı type gelirse) boş dön
  if (!imageSrc) return null;

  return (
    <div 
      className="w-full h-full flex items-center justify-center select-none p-[10%]"
      // Taşın kendisinin değil, görselin sürüklenmesini sağlamak için kapsayıcı ayarı
      draggable={false} 
    >
      <img 
        src={imageSrc} 
        alt={`${color} ${type}`}
        className="w-full h-full object-contain drop-shadow-md transition-transform duration-200 hover:scale-110"
        // Resmin varsayılan sürükleme davranışını kapat (HTML5 Drag&Drop kullanıyorsan buna ihtiyacın olabilir)
        draggable={false}
        // Sağ tık menüsünü engelle (oyun hissi için)
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};
