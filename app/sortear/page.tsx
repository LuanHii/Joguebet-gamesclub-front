"use client";

import { useState, useRef, useEffect } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { RaffleMachine } from '../components/RaffleMachine';
import Confetti from 'react-confetti';
import { motion, useAnimation } from 'framer-motion';

const gameCategories = {
    todos: ["fps", "plataforma", "Metroidvania", "simulador", "futurista", "esporte", "visual novel", "action rpg", "ninja", "terror", "pixel art", "roguelike", "aventura"],
    fps: ["DUSK", "ULTRAKILL", "Gunfire Reborn", "Metal Garden", "Black Mesa", "Forgive Me Father", "Warhammer 40,000: Boltgun", "AVIÃOZINHO DO TRÁFICO 3:ABRI UM PORTAL PRO INFERNO NA FAVELA TENTANDO REVIVER MIT AIA E PRECISO FECHAR", "Easy Red 2", "Outlaws + Handful of Missions: Remaster", "TAMASHIKA", "MULLET MADJACK", "Anger Foot", "BPM: Bullets Per Minute"],
    rpg: ["Ys Origin", "Cat Quest III", "NOBODY SAVES THE WORLD", "Ashen", "The Witcher: Enhanced Edition Director's Cut", "DELTARUNE", "TORCHLIGHT 2", "young souls", "Lunacid", "ELDEST SOULS"
    ],
    plataforma: ["Spiritfarer", "Gravity Circuit", "BZZT, Planet of Lana", "ITORAH", "ElecHead", "Toree3D", "Kirby", "BADLAND", "Convergence"],
    Metroidvania: ["Jogos ainda não sorteados"],
    simulador: ["MegaAquarium", "WolfQuest: Anniversary Edition", "Discounty", "Kerbal Space Program", "Mudborne", "Civilization IV", "DREDGE", "SlimeRancher 2", "Coral Island", "Easy Delivery Co.", "Reus 2", "Little Witch in the Woods"],
    futurista: ["The Plane Effect", "SONOKUNI", "Narita Boy", "Tacoma", "Psychroma", "Jenny the Witch", "Sable", "Cloudpunk", "Katana Zero", "Au Revoir", "MIO: Memories in Orbit", "Cosmic Wheel Sisterhood", "Fallen Knight"],
    esporte: ["Jogos ainda não sorteados"],
    visual_novel: ["Winter Novel", "STEINS;GATE", "VA-11 Hall-A: Cyberpunk Bartender Action", "Danganronpa: Trigger Happy Havoc", "Trouble Comes Twice", "Please Be Happy", "Coffee Talks", "Needy girl overdose", "Teatro dos finais infelizes", "one night", "hot springs"],
    ninja: ["Jogos ainda não sorteados"],
    terror: [ "Alien: Isolation", "SILENT HILL 3", "Alan Wake", "No, I'm not a Human", "Fear the Spotlight", "INMOST", "Amnesia: The Dark Descent", "SILENT HILL", "Into the Pit", "FATAL FRAME II: Crimson Butterfly REMAKE","Mouthwashing"],
    pixel_art: ["Cast n Chill", "Skul: The Hero Slayer", "Sea of Stars", "Potion Permit", "UNSIGHTED", "Rain World", "Hammerwatch Anniversary Edition", "Pizza Tower", "Dandara: Trials of Fear Edition"],
    roguelike: ["Darkest Dungeon", "Rogue Legacy 2", "Death or Treat", "Sundered®: Eldritch Edition", "Magic Typo", "City Of Beats", "The Spell Brigade", "Have a Nice Death"],
    aventura: ["Omno", "Bayonetta", "Zelda: Wind Waker", "Cassette Beasts", "A Lenda do Herói - Edição Definitiva", "Xaolin Showdown", "Devil May Cry HD Collection", "Alice: Madness Returns", "Blood Will Tell: Tezuka Osamu's Dororo"]
};

export default function SortearPage() {
  const [poolItems, setPoolItems] = useState<string[]>([]);
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
  const newItems = item.split(/[, \n]+/).map(i => i.trim()).filter(i => i);  
    setPoolItems(prev => [...prev, item]);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setPoolItems(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClearItems = () => {
    setPoolItems([]);
  }

  const handleAddCategory = (category: string) => {
    const itemsToAdd = gameCategories[category as keyof typeof gameCategories];
    if (itemsToAdd) {
      setPoolItems(prev => [...prev, ...itemsToAdd]);
    }
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
        const finalWinner = chosenWinner;
        setWinner(finalWinner);
        setRafflingItem(finalWinner);
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
        <ControlPanel items={poolItems} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} onClearItems={handleClearItems} onAddCategory={handleAddCategory} categories={Object.keys(gameCategories)}/>
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
