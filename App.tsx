import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'https://esm.sh/chess.js@1.0.0-beta.8';
import { Board } from './Board';
import { Confetti } from './Confetti';
import { getAiMove, getWelcomeMessage, generateSpeech } from '../services/geminiService';
import { makeMove, isCheckmate, isDraw, isCheck, getLegalMoves } from '../services/chessLogic';
import { soundEffects } from '../services/soundEffects';
import { GameStatus, Move, PlayerColor } from '../types';
import { RefreshCw, Sparkles, Star, Volume2, Play, Undo } from 'lucide-react';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// --- Audio Helper Functions ---

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// ------------------------------

const App = () => {
  const [fen, setFen] = useState<string>(INITIAL_FEN);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'system', text: string }[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [turn, setTurn] = useState<PlayerColor>(PlayerColor.WHITE);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Move history for undo functionality
  const [moveHistory, setMoveHistory] = useState<{ fen: string, move: Move | null }[]>([{ fen: INITIAL_FEN, move: null }]);

  // Confetti trigger
  const [showConfetti, setShowConfetti] = useState(false);

  // Audio Context Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    } else if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const stopCurrentAudio = () => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop();
        activeSourceRef.current.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      activeSourceRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const playVoice = async (text: string) => {
    try {
      stopCurrentAudio();

      setIsPlayingAudio(true);
      const base64Audio = await generateSpeech(text);

      if (base64Audio && audioContextRef.current) {
        const pcmData = decodeBase64(base64Audio);
        const audioBuffer = await pcmToAudioBuffer(pcmData, audioContextRef.current);

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);

        activeSourceRef.current = source;

        source.onended = () => {
          if (activeSourceRef.current === source) {
            setIsPlayingAudio(false);
            activeSourceRef.current = null;
          }
        };

        source.start(0);
      } else {
        setIsPlayingAudio(false);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
      setIsPlayingAudio(false);
    }
  };

  const startGame = async () => {
    initAudio();
    setStatus(GameStatus.AI_THINKING); // Temporarily show loading state
    const welcome = await getWelcomeMessage();
    setMessages([{ sender: 'ai', text: welcome }]);
    setStatus(GameStatus.PLAYING);
    playVoice(welcome);
  };

  const restartGame = () => {
    stopCurrentAudio(); // Stop any talking
    setFen(INITIAL_FEN);
    setStatus(GameStatus.PLAYING);
    const restartMsg = "Hadi tekrar oynayalım! Başarılar Prenses!";
    setMessages([{ sender: 'ai', text: restartMsg }]);
    setLastMove(null);
    setTurn(PlayerColor.WHITE);
    setMoveHistory([{ fen: INITIAL_FEN, move: null }]);
    playVoice(restartMsg);
  };

  const undoMove = () => {
    if (moveHistory.length <= 1 || isPlayingAudio || status !== GameStatus.PLAYING) return;

    // Undo last 2 moves (player + AI)
    const newHistory = moveHistory.slice(0, -2);
    const lastState = newHistory[newHistory.length - 1];

    setMoveHistory(newHistory);
    setFen(lastState.fen);
    setLastMove(lastState.move);
    setTurn(PlayerColor.WHITE);
    soundEffects.playUndo();

    const undoMsg = "Sorun değil, tekrar dene Prenses! 💖";
    setMessages(prev => [...prev, { sender: 'ai', text: undoMsg }]);
  };

  const handlePlayerMove = async (move: Move) => {
    // Konuşma bitmeden hamle yapılmasını engelle
    if (isPlayingAudio) return;

    if (status !== GameStatus.PLAYING) return;

    // Ensure audio context is active on user interaction
    initAudio();

    const newFen = makeMove(fen, move);
    if (newFen) {
      // Check if it's a capture move
      const chess = new Chess(fen);
      const moveObj = chess.get(move.to as any);
      const isCapture = moveObj !== null;

      setFen(newFen);
      setLastMove(move);
      setTurn(PlayerColor.BLACK);
      setMoveHistory(prev => [...prev, { fen: newFen, move }]);

      // Play appropriate sound
      if (isCapture) {
        soundEffects.playCapture();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      } else {
        soundEffects.playMove();
      }

      // Check game end conditions
      if (isCheckmate(newFen)) {
        setStatus(GameStatus.GAME_OVER);
        const msg = "Harika! Kazandın Prenses! 🎉";
        setMessages(prev => [...prev, { sender: 'system', text: msg }]);
        soundEffects.playWin();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
        playVoice(msg);
        return;
      }

      setStatus(GameStatus.AI_THINKING);

      // AI Turn
      try {
        const legalMoves = getLegalMoves(newFen);

        // Small delay for realism
        setTimeout(async () => {
          try {
            const aiResponse = await getAiMove(newFen, legalMoves);

            const aiMove: Move = { from: aiResponse.from, to: aiResponse.to, promotion: 'q' };
            const aiNewFen = makeMove(newFen, aiMove);

            if (aiNewFen) {
              // Check if AI captured a piece
              const chessAi = new Chess(newFen);
              const aiCaptured = chessAi.get(aiMove.to as any) !== null;

              setFen(aiNewFen);
              setLastMove(aiMove);
              setMoveHistory(prev => [...prev, { fen: aiNewFen, move: aiMove }]);
              setMessages(prev => [...prev, { sender: 'ai', text: aiResponse.message }]);

              // Play AI move sound
              if (aiCaptured) {
                soundEffects.playCapture();
              } else {
                soundEffects.playMove();
              }

              // AI hamlesini yaptı, ses konuşmaya başlayacak
              // PlayVoice'ı önce çağırıyoruz ki isPlayingAudio true olsun ve tahta kilitlensin
              playVoice(aiResponse.message);

              setTurn(PlayerColor.WHITE);

              if (isCheckmate(aiNewFen)) {
                setStatus(GameStatus.GAME_OVER);
                const winMsg = "Sihirli Unicorn kazandı! İyi oyundu! 🦄";
                setMessages(prev => [...prev, { sender: 'system', text: winMsg }]);
                soundEffects.playWin();
                playVoice(winMsg);
              } else if (isCheck(aiNewFen)) {
                const checkMsg = "Dikkat et Prenses, şahın tehlikede!";
                setMessages(prev => [...prev, { sender: 'system', text: checkMsg }]);
                soundEffects.playCheck();
                playVoice(checkMsg);
                setStatus(GameStatus.PLAYING);
              } else {
                setStatus(GameStatus.PLAYING);
              }
            } else {
              // Fallback move
              const randomMoveSan = legalMoves[Math.floor(Math.random() * legalMoves.length)];
              const from = randomMoveSan.substring(0, 2);
              const to = randomMoveSan.substring(2, 4);
              const randomMoveObj = { from, to, promotion: 'q' };

              const fallbackFen = makeMove(newFen, randomMoveObj);
              if (fallbackFen) {
                setFen(fallbackFen);
                setLastMove(randomMoveObj);
                setTurn(PlayerColor.WHITE);
                setStatus(GameStatus.PLAYING);
                const fallbackMsg = "Hmmm, ne yapsam acaba? Şöyle oynayayım!";
                setMessages(prev => [...prev, { sender: 'ai', text: fallbackMsg }]);
                playVoice(fallbackMsg);
              }
            }
          } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { sender: 'system', text: "Sihirli Unicorn biraz daldı, tekrar deneyelim mi?" }]);
            setStatus(GameStatus.PLAYING);
          }
        }, 500);

      } catch (error) {
        console.error("Error in game loop", error);
        setStatus(GameStatus.PLAYING);
      }
    }
  };

  // --- Initial Screen ---
  if (status === GameStatus.IDLE) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm border-4 border-pink-200">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-6xl shadow-inner">
            🦄
          </div>
          <h1 className="text-4xl font-bold text-pink-600 mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>Masal Satrancı</h1>
          <p className="text-purple-600 mb-8 text-lg">Sihirli Unicorn seninle oynamak istiyor!</p>

          <button
            onClick={startGame}
            className="bg-gradient-to-r from-pink-400 to-purple-400 text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-3"
          >
            <Play fill="currentColor" /> Oyuna Başla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 flex flex-col items-center p-4 font-sans">
      <Confetti trigger={showConfetti} />

      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-6 pt-4">
        <div className="flex items-center gap-2">
          <div className="bg-pink-400 p-2 rounded-full text-white shadow-md">
            <Star size={24} fill="white" />
          </div>
          <h1 className="text-3xl font-bold text-pink-600 drop-shadow-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Masal Satrancı
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={undoMove}
            disabled={moveHistory.length <= 1 || isPlayingAudio || status !== GameStatus.PLAYING}
            className="bg-white p-2 rounded-full shadow-md hover:bg-purple-100 transition-colors text-purple-500 border-2 border-purple-200 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Geri Al"
          >
            <Undo size={24} />
          </button>
          <button
            onClick={restartGame}
            className="bg-white p-2 rounded-full shadow-md hover:bg-pink-100 transition-colors text-pink-500 border-2 border-pink-200"
            title="Yeniden Başlat"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </header>

      <main className="w-full max-w-md flex flex-col items-center gap-6">

        {/* Opponent Area (AI) */}
        <div className="w-full flex items-center gap-4 px-4">
          <div className={`relative w-16 h-16 rounded-full border-4 ${turn === PlayerColor.BLACK ? 'border-yellow-400 scale-110' : 'border-purple-300'} bg-purple-100 flex items-center justify-center shadow-lg transition-all duration-300`}>
            <span className="text-4xl">🦄</span>
            {isPlayingAudio && (
              <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1 animate-pulse">
                <Volume2 size={12} className="text-white" />
              </div>
            )}
            {turn === PlayerColor.BLACK && !isPlayingAudio && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                Düşünüyor...
              </div>
            )}
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border-2 border-purple-100 max-w-[70%]">
            <p className="text-purple-800 font-medium text-sm leading-relaxed">
              {messages.filter(m => m.sender === 'ai').slice(-1)[0]?.text || "Merhaba!"}
            </p>
          </div>
        </div>

        {/* Board */}
        <div className="w-full px-2">
          <Board
            fen={fen}
            onMove={handlePlayerMove}
            // Disable board if game not playing, not player's turn, OR audio is playing
            disabled={status !== GameStatus.PLAYING || turn !== PlayerColor.WHITE || isPlayingAudio}
            lastMove={lastMove}
          />
        </div>

        {/* Player Area */}
        <div className="w-full flex items-center justify-end gap-4 px-4">
          <div className="bg-white px-4 py-3 rounded-2xl rounded-tr-none shadow-sm border-2 border-pink-100 max-w-[70%] text-right">
            <p className="text-pink-800 font-medium text-sm">
              {turn === PlayerColor.WHITE && !isPlayingAudio ? "Sıra bende! Nereye gitsem?" : "Sihirli Unicorn konuşuyor..."}
            </p>
          </div>
          <div className={`w-16 h-16 rounded-full border-4 ${turn === PlayerColor.WHITE && !isPlayingAudio ? 'border-yellow-400 scale-110' : 'border-pink-300'} bg-pink-100 flex items-center justify-center shadow-lg transition-all duration-300`}>
            <span className="text-4xl">👸</span>
          </div>
        </div>

        {/* System Messages / Encouragement */}
        {messages.length > 0 && messages[messages.length - 1].sender === 'system' && (
          <div className="mt-2 flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full shadow-sm animate-pulse">
            <Sparkles size={16} />
            <span className="font-bold">{messages[messages.length - 1].text}</span>
          </div>
        )}

      </main>

      <div ref={messagesEndRef} />
    </div>
  );
};

export default App;
