import React, { useEffect, useState } from 'react';

interface ConfettiProps {
    trigger: boolean;
    onComplete?: () => void;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger, onComplete }) => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (!trigger) return;

        const colors = ['#FF69B4', '#FFB6C1', '#DDA0DD', '#9370DB', '#FFD700', '#FFA500'];
        const newParticles: Particle[] = [];

        // Create 30 confetti particles
        for (let i = 0; i < 30; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100, // Random horizontal position (%)
                y: -10, // Start above viewport
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 10 + 5, // 5-15px
                speedX: (Math.random() - 0.5) * 2, // Horizontal drift
                speedY: Math.random() * 3 + 2, // Fall speed
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
            });
        }

        setParticles(newParticles);

        // Clear particles after animation
        const timeout = setTimeout(() => {
            setParticles([]);
            onComplete?.();
        }, 3000);

        return () => clearTimeout(timeout);
    }, [trigger, onComplete]);

    if (particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute animate-confetti-fall"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        backgroundColor: particle.color,
                        transform: `rotate(${particle.rotation}deg)`,
                        animation: `confetti-fall 3s ease-out forwards`,
                        '--speed-y': particle.speedY,
                        '--speed-x': particle.speedX,
                        '--rotation-speed': particle.rotationSpeed,
                    } as React.CSSProperties}
                />
            ))}
            <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) translateX(calc(var(--speed-x) * 50px)) rotate(calc(var(--rotation-speed) * 360deg));
            opacity: 0;
          }
        }
      `}</style>
        </div>
    );
};

