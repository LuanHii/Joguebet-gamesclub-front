"use client";

import { useState, useRef, useEffect } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { RaffleMachine } from '../components/RaffleMachine';
import Confetti from 'react-confetti';

export default function SortearPage() {
  const [poolItems, setPoolItems] = useState<string[]>(['God of War', 'Elden Ring', 'Baldur\'s Gate 3']);
  const [isRaffling, setIsRaffling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rafflingItem, setRafflingItem] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const leverSoundRef = useRef<HTMLAudioElement>(null);
  const spinningSoundRef = useRef<HTMLAudioElement>(null);
  const winSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddItem = (item: string) => {
    setPoolItems(prev => [...prev, item]);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setPoolItems(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRaffle = () => {
    if (poolItems.length < 2 || isRaffling) return;
    
    leverSoundRef.current?.play();
    spinningSoundRef.current?.play();

    setIsRaffling(true);
    setWinner(null);
    setShowConfetti(false);
    setRafflingItem(poolItems[0]);

    const chosenWinner = poolItems[Math.floor(Math.random() * poolItems.length)];
    const raffleDuration = 4000;
    const intervalTime = 75;

    const raffleInterval = setInterval(() => {
      const randomItem = poolItems[Math.floor(Math.random() * poolItems.length)];
      setRafflingItem(randomItem);
    }, intervalTime);
    
    setTimeout(() => {
        clearInterval(raffleInterval);
        spinningSoundRef.current?.pause();
        winSoundRef.current?.play();
        setWinner(chosenWinner);
        setRafflingItem(chosenWinner);
        setIsRaffling(false);
        setShowConfetti(true);
    }, raffleDuration);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] justify-between overflow-x-hidden">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}
      
      <audio ref={leverSoundRef} src="/sounds/lever-pull.mp3" preload="auto"></audio>
      <audio ref={spinningSoundRef} src="/sounds/slot-reels.mp3" preload="auto" loop></audio>
      <audio ref={winSoundRef} src="/sounds/jackpot-win.mp3" preload="auto"></audio>
      
      <header className="text-center my-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold custom-text drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] mt-4 mb-4">
          Cassino dos jogos!
        </h1>
        <p className="text-slate-400 mt-1">Prepare os itens e puxe a alavanca!</p>
      </header>

      <ControlPanel items={poolItems} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} />

      <RaffleMachine 
        onRaffle={handleRaffle} 
        isRaffling={isRaffling} 
        isDisabled={poolItems.length < 2}
        displayItem={rafflingItem}
        isWinner={!!winner}
      />
    </div>
  );
}