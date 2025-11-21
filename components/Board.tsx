import React, { useState, useEffect } from 'react';
import { getValidMovesForSquare, getPieceAt } from '../services/chessLogic';
import { Piece } from './Piece';
import { Move, PlayerColor } from '../types';

interface BoardProps {
  fen: string;
  onMove: (move: Move) => void;
  disabled: boolean;
  lastMove: Move | null;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

export const Board: React.FC<BoardProps> = ({ fen, onMove, disabled, lastMove }) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);

  // Reset selection when FEN changes (move made)
  useEffect(() => {
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [fen]);

  const handleSquareClick = (square: string) => {
    if (disabled) return;

    const piece = getPieceAt(fen, square);

    // If selecting a piece to move
    if (selectedSquare === null) {
      if (piece && piece.color === PlayerColor.WHITE) {
        setSelectedSquare(square);
        const moves = getValidMovesForSquare(fen, square);
        setPossibleMoves(moves);
      }
    } else {
      // If a square is already selected
      if (possibleMoves.includes(square)) {
        // Valid move
        onMove({ from: selectedSquare, to: square, promotion: 'q' }); // Always promote to queen for simplicity for kids
      } else if (piece && piece.color === PlayerColor.WHITE) {
        // Changing selection to another white piece
        setSelectedSquare(square);
        const moves = getValidMovesForSquare(fen, square);
        setPossibleMoves(moves);
      } else {
        // Clicked elsewhere, deselect
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    }
  };

  return (
    <div className={`w-full max-w-[400px] mx-auto ${disabled ? 'opacity-80 pointer-events-none grayscale-[0.3]' : ''} transition-all duration-300 select-none`}>
      <div className="grid grid-cols-[auto_1fr] gap-1">

        {/* Ranks (Left side) */}
        <div className="flex flex-col justify-around text-pink-400 font-bold text-xs sm:text-sm py-2">
          {RANKS.map((rank) => (
            <div key={rank} className="flex-1 flex items-center justify-center px-1">{rank}</div>
          ))}
        </div>

        {/* Chess Board */}
        <div
          className="grid grid-cols-8 gap-0 w-full aspect-square border-4 border-pink-300 rounded-xl overflow-hidden shadow-2xl bg-white ring-4 ring-pink-100"
        >
          {RANKS.map((rank, rankIndex) => (
            FILES.map((file, fileIndex) => {
              const square = `${file}${rank}`;
              const isDark = (rankIndex + fileIndex) % 2 === 1;
              const piece = getPieceAt(fen, square);
              const isSelected = selectedSquare === square;
              const isPossibleMove = possibleMoves.includes(square);
              const isLastMoveSource = lastMove?.from === square;
              const isLastMoveDest = lastMove?.to === square;

              // Colors
              let bgClass = isDark ? 'bg-pink-200' : 'bg-pink-50'; // Soft pink theme

              // Apply selected square styling with yellow pulsing animation
              if (isSelected) {
                bgClass = 'bg-yellow-300 animate-pulse';
              }
              // Apply last move highlighting with purple color
              else if (isLastMoveSource || isLastMoveDest) {
                bgClass = isDark ? 'bg-purple-300' : 'bg-purple-200';
              }

              return (
                <div
                  key={square}
                  onClick={() => handleSquareClick(square)}
                  // 'aspect-square' ensures specific square ratio
                  // 'overflow-hidden' prevents large pieces from expanding the cell
                  className={`relative w-full h-full aspect-square ${bgClass} flex items-center justify-center overflow-hidden transition-colors duration-200`}
                >
                  {/* Possible Move Indicator - Green dot for empty squares, Red ring for captures */}
                  {isPossibleMove && (
                    <div className={`absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full ${piece ? 'bg-red-500 ring-4 ring-red-300 opacity-70' : 'bg-green-400 opacity-60'} z-10 pointer-events-none`} />
                  )}

                  {piece && (
                    <div className="z-20 w-full h-full flex items-center justify-center">
                      <Piece type={piece.type} color={piece.color === 'w' ? PlayerColor.WHITE : PlayerColor.BLACK} />
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>

        {/* Spacer for bottom-left corner */}
        <div></div>

        {/* Files (Bottom side) */}
        <div className="flex justify-around text-pink-400 font-bold text-xs sm:text-sm pt-1">
          {FILES.map((file) => (
            <div key={file} className="flex-1 text-center">{file}</div>
          ))}
        </div>

      </div>
    </div>
  );
};
