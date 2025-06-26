import React, { useEffect, useRef, useState } from 'react';
import { calculateLevel } from '@/utils/levelCalculator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CharacterIllustrationProps {
  strengthXp: number;
  disciplineXp: number;
  healthXp: number;
  intelligenceXp: number;
}

const CharacterIllustration: React.FC<CharacterIllustrationProps> = ({ strengthXp, disciplineXp, healthXp, intelligenceXp }) => {
  const { level: strengthLevel } = calculateLevel(strengthXp);
  const { level: disciplineLevel } = calculateLevel(disciplineXp);
  const { level: healthLevel } = calculateLevel(healthXp);
  const { level: intelligenceLevel } = calculateLevel(intelligenceXp);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<'azul' | 'vermelho' | 'amarelo' | 'verde'>('azul');
  const [previousLevels, setPreviousLevels] = useState({ strengthLevel: 0, disciplineLevel: 0, healthLevel: 0, intelligenceLevel: 0 });
  const [unlockedAccessories, setUnlockedAccessories] = useState({
    headband: true,
    chain: true,
    mathPi: true,
    snake: true
  });
  const [showUnlockNotifications, setShowUnlockNotifications] = useState<string[]>([]);
  const [isAccessoryManagementOpen, setIsAccessoryManagementOpen] = useState(false);
  const { toast } = useToast();

  // Check for newly unlocked accessories
  useEffect(() => {
    const newUnlocks: { name: string; image: string }[] = [];

    if (strengthLevel >= 2 && previousLevels.strengthLevel < 2) {
      newUnlocks.push({ name: 'Bandana de Força', image: '/assets/headband.png' });
    }
    if (disciplineLevel >= 2 && previousLevels.disciplineLevel < 2) {
      newUnlocks.push({ name: 'Corrente Dourada', image: '/assets/golden_chain.png' });
    }
    if (intelligenceLevel >= 2 && previousLevels.intelligenceLevel < 2) {
      newUnlocks.push({ name: 'Símbolo Pi', image: '/assets/math_pi.png' });
    }
    if (healthLevel >= 2 && previousLevels.healthLevel < 2) {
      newUnlocks.push({ name: 'Cobra de Asclépio', image: '/assets/asclepius_snake.png' });
    }

    if (newUnlocks.length > 0) {
      setShowUnlockNotifications(newUnlocks.map(item => item.name));
      
      // Hide notifications after 5 seconds
      setTimeout(() => {
        setShowUnlockNotifications([]);
      }, 5000);
    }

    setPreviousLevels({ strengthLevel, disciplineLevel, healthLevel, intelligenceLevel });
  }, [strengthLevel, disciplineLevel, healthLevel, intelligenceLevel, previousLevels]);

  const originalColors = [
    { r: 7, g: 121, b: 185 },  // Azul claro (#0779b9)
    { r: 0, g: 30, b: 125 },   // Azul escuro (#001e7d)
  ];

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

  const getNextUnlockMessage = () => {
    const unlocks = [];
    
    if (strengthLevel < 2) {
      const levelsNeeded = 2 - strengthLevel;
      unlocks.push(`Falta ${levelsNeeded === 1 ? 'aumentar 1 nível' : `aumentar ${levelsNeeded} níveis`} de Força para desbloquear a Bandana`);
    }
    if (disciplineLevel < 2) {
      const levelsNeeded = 2 - disciplineLevel;
      unlocks.push(`Falta ${levelsNeeded === 1 ? 'aumentar 1 nível' : `aumentar ${levelsNeeded} níveis`} de Disciplina para desbloquear a Corrente`);
    }
    if (intelligenceLevel < 2) {
      const levelsNeeded = 2 - intelligenceLevel;
      unlocks.push(`Falta ${levelsNeeded === 1 ? 'aumentar 1 nível' : `aumentar ${levelsNeeded} níveis`} de Inteligência para desbloquear o Símbolo Pi`);
    }
    if (healthLevel < 2) {
      const levelsNeeded = 2 - healthLevel;
      unlocks.push(`Falta ${levelsNeeded === 1 ? 'aumentar 1 nível' : `aumentar ${levelsNeeded} níveis`} de Saúde para desbloquear a Cobra`);
    }

    return unlocks.length > 0 ? unlocks[0] : null;
  };

  useEffect(() => {
    const image = new Image();
    image.src = '/assets/main_character_1.png';

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

            if (r === originalColors[0].r && g === originalColors[0].g && b === originalColors[0].b) {
              data[i] = targetLight.r;
              data[i + 1] = targetLight.g;
              data[i + 2] = targetLight.b;
            }

            if (r === originalColors[1].r && g === originalColors[1].g && b === originalColors[1].b) {
              data[i] = targetDark.r;
              data[i + 1] = targetDark.g;
              data[i + 2] = targetDark.b;
            }
          }

          ctx.putImageData(imageData, 0, 0);

          // Acessórios opcionais
          const drawAccessories = async () => {
            if (strengthLevel >= 2 && unlockedAccessories.headband) {
              const headband = new Image();
              headband.src = '/assets/headband.png';
              await new Promise<void>((resolve) => {
                headband.onload = () => {
                  ctx.drawImage(headband, 0, 0, canvas.width, canvas.height);
                  resolve();
                };
              });
            }

            if (disciplineLevel >= 2 && unlockedAccessories.chain) {
              const chain = new Image();
              chain.src = '/assets/golden_chain.png';
              await new Promise<void>((resolve) => {
                chain.onload = () => {
                  ctx.drawImage(chain, 0, 0, canvas.width, canvas.height);
                  resolve();
                };
              });
            }

            if (intelligenceLevel >= 2 && unlockedAccessories.mathPi) {
              const math_pi = new Image();
              math_pi.src = '/assets/math_pi.png';
              await new Promise<void>((resolve) => {
                math_pi.onload = () => {
                  ctx.drawImage(math_pi, 0, 0, canvas.width, canvas.height);
                  resolve();
                };
              });
            }

            if (healthLevel >= 2 && unlockedAccessories.snake) {
              const asclepius_snake = new Image();
              asclepius_snake.src = '/assets/asclepius_snake.png';
              await new Promise<void>((resolve) => {
                asclepius_snake.onload = () => {
                  ctx.drawImage(asclepius_snake, 0, 0, canvas.width, canvas.height);
                  resolve();
                };
              });
            }

            setImageLoaded(true);
          };

          drawAccessories();
        }
      }
    };
  }, [selectedColor, strengthLevel, disciplineLevel, healthLevel, intelligenceLevel, unlockedAccessories]);

  const nextUnlock = getNextUnlockMessage();

  const getAccessoryImage = (accessoryName: string) => {
    const imageMap: Record<string, string> = {
      'Bandana de Força': '/assets/headband.png',
      'Corrente Dourada': '/assets/golden_chain.png',
      'Símbolo Pi': '/assets/math_pi.png',
      'Cobra de Asclépio': '/assets/asclepius_snake.png'
    };
    return imageMap[accessoryName];
  };

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg text-center relative">
      <h3 className="text-white font-semibold mb-4">Seu Personagem</h3>

      {/* Unlock Notifications */}
      {showUnlockNotifications.length > 0 && (
        <div className="absolute top-4 right-4 z-10 space-y-2">
          {showUnlockNotifications.map((accessoryName, index) => (
            <div key={index} className="bg-yellow-500 text-black p-3 rounded-lg shadow-lg animate-fade-in flex items-center gap-3 max-w-xs">
              <img 
                src={getAccessoryImage(accessoryName)} 
                alt={accessoryName}
                className="w-8 h-8 pixel-art"
              />
              <div className="text-left">
                <div className="font-bold text-sm">🎉 Parabéns!</div>
                <div className="text-xs">Você desbloqueou {accessoryName}!</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="relative mx-auto mb-4">
        <canvas
          ref={canvasRef}
          className="pixel-art mx-auto my-10 block"
          style={{
            width: '180px',
            height: '180px',
            display: imageLoaded ? 'block' : 'none',
          }}
        />
      </div>

      <div className="flex justify-center space-x-2 mb-4">
        <button onClick={() => setSelectedColor('azul')} className="px-2 py-1 text-xs rounded bg-blue-600 text-white">
          Azul
        </button>
        <button onClick={() => setSelectedColor('vermelho')} className="px-2 py-1 text-xs rounded bg-red-600 text-white">
          Vermelho
        </button>
        <button onClick={() => setSelectedColor('amarelo')} className="px-2 py-1 text-xs rounded bg-yellow-400 text-black">
          Amarelo
        </button>
        <button onClick={() => setSelectedColor('verde')} className="px-2 py-1 text-xs rounded bg-green-600 text-white">
          Verde
        </button>
      </div>

      {nextUnlock && (
        <div className="text-sm text-blue-400 mb-4">
          🎯 Próximo desbloqueio: {nextUnlock}
        </div>
      )}

      {/* Accessory Management */}
      <div className="mt-4 border-t border-gray-700 pt-4">
        <button
          onClick={() => setIsAccessoryManagementOpen(!isAccessoryManagementOpen)}
          className="flex items-center justify-center gap-2 text-white text-sm font-medium mb-3 w-full hover:text-gray-300 transition-colors"
        >
          Gerenciar Acessórios
          {isAccessoryManagementOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {isAccessoryManagementOpen && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {strengthLevel >= 2 && (
              <label className="flex items-center gap-1 text-gray-300">
                <input
                  type="checkbox"
                  checked={unlockedAccessories.headband}
                  onChange={(e) => setUnlockedAccessories(prev => ({ ...prev, headband: e.target.checked }))}
                  className="w-3 h-3"
                />
                Bandana
              </label>
            )}
            {disciplineLevel >= 2 && (
              <label className="flex items-center gap-1 text-gray-300">
                <input
                  type="checkbox"
                  checked={unlockedAccessories.chain}
                  onChange={(e) => setUnlockedAccessories(prev => ({ ...prev, chain: e.target.checked }))}
                  className="w-3 h-3"
                />
                Corrente
              </label>
            )}
            {intelligenceLevel >= 2 && (
              <label className="flex items-center gap-1 text-gray-300">
                <input
                  type="checkbox"
                  checked={unlockedAccessories.mathPi}
                  onChange={(e) => setUnlockedAccessories(prev => ({ ...prev, mathPi: e.target.checked }))}
                  className="w-3 h-3"
                />
                Símbolo Pi
              </label>
            )}
            {healthLevel >= 2 && (
              <label className="flex items-center gap-1 text-gray-300">
                <input
                  type="checkbox"
                  checked={unlockedAccessories.snake}
                  onChange={(e) => setUnlockedAccessories(prev => ({ ...prev, snake: e.target.checked }))}
                  className="w-3 h-3"
                />
                Cobra
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterIllustration;
