import React, { useEffect, useRef, useState } from 'react';
import { calculateLevel } from '@/utils/levelCalculator';

interface CharacterIllustrationProps {
  strengthXp: number;
}

const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({ strengthXp }) => {
  const { level } = calculateLevel(strengthXp);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<'azul' | 'vermelho' | 'amarelo' | 'verde'>('azul');

  // Cores originais da camiseta (claro e escuro)
  const originalColors = [
    { r: 7, g: 121, b: 185 },  // Azul claro (#0779b9)
    { r: 0, g: 30, b: 125 },   // Azul escuro (#001e7d)
  ];

  // Mapa de cores de destino para cada seleção
  const colorMap: Record<string, { light: { r: number; g: number; b: number }; dark: { r: number; g: number; b: number } }> = {
    azul: {
      light: { r: 7, g: 121, b: 185 },
      dark: { r: 0, g: 30, b: 125 },
    },
    vermelho: {
      light: { r: 255, g: 100, b: 100 },
      dark: { r: 180, g: 0, b: 0 },
    },
    amarelo: {
      light: { r: 255, g: 255, b: 100 },
      dark: { r: 200, g: 150, b: 0 },
    },
    verde: {
      light: { r: 100, g: 255, b: 100 },
      dark: { r: 0, g: 128, b: 0 },
    },
  };

  useEffect(() => {
    const image = new Image();
    image.src = '/assets/new_piskel.png';

    image.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const scale = 4;
          canvas.width = image.width * scale;
          canvas.height = image.height * scale;

          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          const targetLight = colorMap[selectedColor].light;
          const targetDark = colorMap[selectedColor].dark;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Se for o azul claro
            if (r === originalColors[0].r && g === originalColors[0].g && b === originalColors[0].b) {
              data[i] = targetLight.r;
              data[i + 1] = targetLight.g;
              data[i + 2] = targetLight.b;
            }

            // Se for o azul escuro
            if (r === originalColors[1].r && g === originalColors[1].g && b === originalColors[1].b) {
              data[i] = targetDark.r;
              data[i + 1] = targetDark.g;
              data[i + 2] = targetDark.b;
            }
          }

          ctx.putImageData(imageData, 0, 0);

          // Se o nível de força for 2 ou mais, desenha a faixa por cima
          if (level >= 2) {
            const headband = new Image();
            headband.src = '/assets/headband.png';
            headband.onload = () => {
              ctx.drawImage(headband, 0, 0, canvas.width, canvas.height);
              setImageLoaded(true);
            };
          } else {
            setImageLoaded(true);
          }
        }
      }
    };
  }, [selectedColor, level]);

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg text-center">
      <h3 className="text-white font-semibold mb-4">Seu Personagem</h3>

      <div className="relative mx-auto mb-4">
        <canvas
          ref={canvasRef}
          className="pixel-art mx-auto my-10 block"
          style={{
            width: '128px',
            height: '128px',
            display: imageLoaded ? 'block' : 'none',
          }}
        />
      </div>

      {/* Seletor de Cor */}
      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => setSelectedColor('azul')}
          className="px-2 py-1 text-xs rounded bg-blue-600 text-white"
        >
          Azul
        </button>
        <button
          onClick={() => setSelectedColor('vermelho')}
          className="px-2 py-1 text-xs rounded bg-red-600 text-white"
        >
          Vermelho
        </button>
        <button
          onClick={() => setSelectedColor('amarelo')}
          className="px-2 py-1 text-xs rounded bg-yellow-400 text-black"
        >
          Amarelo
        </button>
        <button
          onClick={() => setSelectedColor('verde')}
          className="px-2 py-1 text-xs rounded bg-green-600 text-white"
        >
          Verde
        </button>
      </div>

      <div className="text-sm text-gray-400">Nível de Força: {level}</div>
    </div>
  );
};

export default CharacterIllustration;
