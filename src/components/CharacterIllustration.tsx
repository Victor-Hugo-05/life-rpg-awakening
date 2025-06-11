import React from 'react';
import { calculateLevel } from '@/utils/levelCalculator';

interface CharacterIllustrationProps {
  strengthXp: number;
}

const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({ strengthXp }) => {
  const { level } = calculateLevel(strengthXp);

  const getCharacterStyle = () => {
    if (level >= 15) {
      return "personagem_forte";
    } else if (level >= 10) {
      return "personagem_medio";
    } else if (level >= 5) {
      return "personagem_fraco";
    } else {
      return "personagem_frangasso";
    }
  };

  const characterStyle = getCharacterStyle();
  const imagePath = `/assets/${characterStyle}.png`;

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg text-center">
      <h3 className="text-white font-semibold mb-4">Seu Personagem</h3>

      <div className="relative w-32 h-40 mx-auto mb-4">
        {/* Imagem do personagem */}
        <img
          src={imagePath}
          alt="Personagem"
          className="w-full h-full object-contain"
        />

        {/* Imagem do óculos sobreposta */}
        <img
          src="/assets/oculos.png"
          alt="Óculos"
          className="absolute top-[12px] left-[38%] w-[30px] h-auto"
        />
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
