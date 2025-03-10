import { useEffect, useState } from 'react';
import './EmojiBlast.scss';

// Helper function to generate particles in a circle
const generateCircleParticles = (count: number, radius: number, emojis: string[]) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    particles.push({
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      tx: Math.cos(angle) * radius,
      ty: Math.sin(angle) * radius,
    });
  }
  return particles;
};

/**
 * EmojiBlast component displays an animated burst of emojis in two concentric circles.
 * The emojis appear automatically when the component mounts and disappear after 1 second.
 * The animation is handled by CSS transforms using custom properties (--tx, --ty).
 */
const EmojiBlast: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ emoji: string; tx: number; ty: number }>>([]);

  useEffect(() => {
    const emojis = ['❤️', '🌟', '✨', '🎉', '🤩', '🎊', '⭐️', '💫', '💝', '🎈', '🥂', '🥳'];
    const innerRadius = 30;
    const innerCount = 8;
    const outerRadius = 60;
    const outerCount = 12;

    const newParticles = [
      ...generateCircleParticles(innerCount, innerRadius, emojis),
      ...generateCircleParticles(outerCount, outerRadius, emojis),
    ];

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  }, []);

  return (
    <div className="emoji-blast">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="emoji-blast__single"
          style={
            {
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
            } as React.CSSProperties
          }
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
};

export default EmojiBlast;
