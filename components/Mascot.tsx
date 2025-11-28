import React from 'react';

interface MascotProps {
  remainingPercentage: number;
}

export const Mascot: React.FC<MascotProps> = ({ remainingPercentage }) => {
  // Determine mood based on remaining budget percentage
  const getMood = () => {
    if (remainingPercentage > 50) return 'happy';
    if (remainingPercentage > 20) return 'neutral';
    return 'panic';
  };

  const mood = getMood();

  return (
    <div className="w-24 h-24 relative flex items-center justify-center transition-all duration-500 transform hover:scale-110">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
        {/* Body - Macaron Shape */}
        <ellipse cx="100" cy="100" rx="90" ry="80" fill={mood === 'panic' ? "#fda4af" : mood === 'neutral' ? "#fde047" : "#86efac"} />
        <ellipse cx="100" cy="90" rx="85" ry="75" fill={mood === 'panic' ? "#fb7185" : mood === 'neutral' ? "#facc15" : "#4ade80"} />
        
        {/* Cream */}
        <path d="M 20 100 Q 100 130 180 100" stroke="white" strokeWidth="15" fill="none" strokeLinecap="round" />

        {/* Face */}
        {mood === 'happy' && (
          <g>
            {/* Eyes */}
            <circle cx="65" cy="90" r="8" fill="#1f2937" />
            <circle cx="135" cy="90" r="8" fill="#1f2937" />
            {/* Mouth */}
            <path d="M 80 110 Q 100 125 120 110" stroke="#1f2937" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Cheeks */}
            <circle cx="50" cy="105" r="10" fill="#f472b6" opacity="0.6" />
            <circle cx="150" cy="105" r="10" fill="#f472b6" opacity="0.6" />
          </g>
        )}

        {mood === 'neutral' && (
          <g>
            {/* Eyes */}
            <circle cx="65" cy="90" r="8" fill="#1f2937" />
            <circle cx="135" cy="90" r="8" fill="#1f2937" />
            {/* Mouth */}
            <line x1="80" y1="115" x2="120" y2="115" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
            {/* Sweat */}
            <path d="M 160 60 Q 170 70 160 80" stroke="#3b82f6" strokeWidth="3" fill="none" />
          </g>
        )}

        {mood === 'panic' && (
          <g>
            {/* Eyes (X shape) */}
            <path d="M 55 80 L 75 100 M 75 80 L 55 100" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
            <path d="M 125 80 L 145 100 M 145 80 L 125 100" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
            {/* Mouth (Wavy) */}
            <path d="M 80 120 Q 90 110 100 120 Q 110 130 120 120" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />
             {/* Sweat */}
             <circle cx="100" cy="50" r="5" fill="#bae6fd" />
             <circle cx="150" cy="60" r="6" fill="#bae6fd" />
          </g>
        )}
      </svg>
    </div>
  );
};