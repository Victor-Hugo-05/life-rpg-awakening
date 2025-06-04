import React from 'react';
import { calculateLevel } from '@/utils/levelCalculator';

interface CharacterIllustrationProps {
  strengthXp: number;
}

const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({ strengthXp }) => {
  const { level } = calculateLevel(strengthXp);

  // Define o estilo do personagem com base no nível de força
  const getCharacterStyle = () => {
    if (level >= 15) {
      return "personagem_forte"; // personagem_forte.png
    } else if (level >= 10) {
      return "personagem_medio"; // personagem_medio.png
    } else if (level >= 5) {
      return "personagem_fraco"; // personagem_fraco.png
    } else {
      return "personagem_frangasso"; // personagem_frangasso.png
    }
  };

  const characterStyle = getCharacterStyle();
  const imagePath = `/assets/${characterStyle}.png`;

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg text-center">
      <h3 className="text-white font-semibold mb-4">Seu Personagem</h3>

      <div className="relative w-32 h-40 mx-auto mb-4">
        <img src={imagePath} alt="Personagem" className="w-full h-full object-contain" />
      </div>

      <div className="text-sm text-gray-400">
        Nível de Força: {level}
        <br />
        {characterStyle === "personagem_forte" && "Extremamente Forte! 💪"}
        {characterStyle === "personagem_medio" && "Muito Forte! 💪"}
        {characterStyle === "personagem_fraco" && "Em Forma! 💪"}
        {characterStyle === "personagem_frangasso" && "Iniciante 🌱"}
      </div>
    </div>
  );
};

export default CharacterIllustration;
