import React from 'react';
import { PlayerColor } from '../types';

interface PieceProps {
  type: string; // p, n, b, r, q, k
  color: PlayerColor;
}

export const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const isWhite = color === PlayerColor.WHITE;

  // Standart Unicode Satranç Karakterleri (Hepsi dolu/solid versiyon kullanılıyor)
  // Renklendirmeyi CSS ile yapacağız.
  const symbols: Record<string, string> = {
    p: '♟',
    r: '♜',
    n: '♞',
    b: '♝',
    q: '♛',
    k: '♚',
  };

  const symbol = symbols[type.toLowerCase()] || '';

  // iPhone/iOS Düzeltmesi:
  // Karakterin sonuna '\uFE0E' (Variation Selector-15) ekleyerek
  // cihazı bu karakteri "Emoji" değil "Metin" olarak göstermeye zorluyoruz.
  // Bu sayede CSS renklerimiz çalışır.
  const textContent = `${symbol}\uFE0E`;

  return (
    <div 
      className="w-full h-full flex items-center justify-center leading-none select-none pb-1 sm:pb-2 transition-transform hover:scale-110"
      style={{
        // Taş Boyutu
        fontSize: 'clamp(24px, 8vw, 48px)', 
        
        // Renk Ayarları
        color: isWhite ? '#FFFFFF' : '#581c87', // Beyaz Taşlar: Beyaz, Siyah Taşlar: Koyu Mor
        
        // Kontür (Dış Çizgi) - Beyaz taşların görünmesi için KRİTİK
        WebkitTextStroke: isWhite ? '1.5px #334155' : '1.5px #ffffff', // Beyaz taşa gri çerçeve, Mor taşa beyaz çerçeve
        
        // Gölge (Derinlik katar)
        filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))',

        // iOS Emoji Engelleme
        fontFamily: '"Segoe UI Symbol", "DejaVu Sans", sans-serif', // Emoji fontu yerine sembol fontlarını önceliklendir
        fontVariantEmoji: 'text', // Modern tarayıcılar için ipucu
      }}
    >
      {textContent}
    </div>
  );
};
