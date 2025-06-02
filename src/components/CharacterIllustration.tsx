
import React from 'react';
import { calculateLevel } from '@/utils/levelCalculator';

interface CharacterIllustrationProps {
  strengthXp: number;
}

const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({ strengthXp }) => {
  const { level } = calculateLevel(strengthXp);
  
  // Character gets more muscular as strength level increases
  const getCharacterStyle = () => {
    if (level >= 15) {
      return "very-strong"; // Very muscular
    } else if (level >= 10) {
      return "strong"; // Muscular
    } else if (level >= 5) {
      return "fit"; // Athletic
    } else {
      return "normal"; // Regular build
    }
  };

  const characterStyle = getCharacterStyle();

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg text-center">
      <h3 className="text-white font-semibold mb-4">Seu Personagem</h3>
      
      <div className="relative w-32 h-40 mx-auto mb-4">
        {/* Character body based on strength level */}
        <svg viewBox="0 0 100 120" className="w-full h-full">
          {/* Head */}
          <circle cx="50" cy="15" r="12" fill="white" stroke="black" strokeWidth="2"/>
          
          {/* Body - gets wider with more strength */}
          <rect 
            x={characterStyle === "very-strong" ? "35" : characterStyle === "strong" ? "38" : characterStyle === "fit" ? "40" : "42"} 
            y="25" 
            width={characterStyle === "very-strong" ? "30" : characterStyle === "strong" ? "24" : characterStyle === "fit" ? "20" : "16"} 
            height="40" 
            fill="white" 
            stroke="black" 
            strokeWidth="2"
          />
          
          {/* Arms - get thicker with more strength */}
          <rect 
            x="25" 
            y="30" 
            width={characterStyle === "very-strong" ? "8" : characterStyle === "strong" ? "6" : "4"} 
            height="25" 
            fill="white" 
            stroke="black" 
            strokeWidth="2"
          />
          <rect 
            x={characterStyle === "very-strong" ? "67" : characterStyle === "strong" ? "68" : "70"} 
            y="30" 
            width={characterStyle === "very-strong" ? "8" : characterStyle === "strong" ? "6" : "4"} 
            height="25" 
            fill="white" 
            stroke="black" 
            strokeWidth="2"
          />
          
          {/* Legs */}
          <rect x="43" y="65" width="6" height="30" fill="white" stroke="black" strokeWidth="2"/>
          <rect x="51" y="65" width="6" height="30" fill="white" stroke="black" strokeWidth="2"/>
          
          {/* Muscle definition for stronger characters */}
          {characterStyle === "very-strong" && (
            <>
              <line x1="40" y1="35" x2="60" y2="35" stroke="black" strokeWidth="1" />
              <line x1="42" y1="45" x2="58" y2="45" stroke="black" strokeWidth="1" />
              <circle cx="30" cy="42" r="2" fill="none" stroke="black" strokeWidth="1"/>
              <circle cx="70" cy="42" r="2" fill="none" stroke="black" strokeWidth="1"/>
            </>
          )}
          
          {characterStyle === "strong" && (
            <>
              <line x1="42" y1="40" x2="58" y2="40" stroke="black" strokeWidth="1" />
              <circle cx="32" cy="42" r="1.5" fill="none" stroke="black" strokeWidth="1"/>
              <circle cx="68" cy="42" r="1.5" fill="none" stroke="black" strokeWidth="1"/>
            </>
          )}
        </svg>
      </div>
      
      <div className="text-sm text-gray-400">
        Nível de Força: {level}
        <br />
        {characterStyle === "very-strong" && "Extremamente Forte! 💪"}
        {characterStyle === "strong" && "Muito Forte! 💪"}
        {characterStyle === "fit" && "Em Forma! 💪"}
        {characterStyle === "normal" && "Iniciante 🌱"}
      </div>
    </div>
  );
};

export default CharacterIllustration;
