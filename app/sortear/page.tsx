"use client";

import { useState, useRef, useEffect } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { RaffleMachine } from '../components/RaffleMachine';
import Confetti from 'react-confetti';
import { motion, useAnimation } from 'framer-motion';

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

  const controls = useAnimation();

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
    controls.start({
      x: [0, -2, 2, -2, 2, 0],
      transition: { duration: 0.3 }
    });
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
    <motion.div
      animate={controls}
      className="flex flex-col min-h-[100dvh] justify-between overflow-x-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950"
    >
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}
      
      <audio ref={leverSoundRef} src="/sounds/lever-pull.mp3" preload="auto"></audio>
      <audio ref={spinningSoundRef} src="/sounds/slot-reels.mp3" preload="auto" loop></audio>
      <audio ref={winSoundRef} src="/sounds/jackpot-win.mp3" preload="auto"></audio>
      
      <header className="text-center py-6 flex-shrink-0 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-400 text-glow-gold mt-4 mb-2">
          Cassino dos Jogos!
        </h1>
        <p className="text-slate-400">Prepare os itens e puxe a alavanca!</p>
      </header>

      <main className="flex-grow flex flex-col justify-center py-4">
        <ControlPanel items={poolItems} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} />
      </main>
      
      <footer className="flex-shrink-0">
        <RaffleMachine 
          onRaffle={handleRaffle} 
          isRaffling={isRaffling} 
          isDisabled={poolItems.length < 2}
          displayItem={rafflingItem}
          isWinner={!!winner}
        />
      </footer>
    </motion.div>
  );
}