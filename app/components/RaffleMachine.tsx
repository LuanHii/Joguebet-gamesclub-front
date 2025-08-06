"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Lever({ onPull, isDisabled, isRaffling }: { onPull: () => void, isDisabled: boolean, isRaffling: boolean }) {
  const [isPulled, setIsPulled] = useState(false);

  const handlePull = () => {
    if (isDisabled || isRaffling) return;
    setIsPulled(true);
    onPull();
    setTimeout(() => setIsPulled(false), 500);
  };

  const leverState = isDisabled ? 'disabled' : (isRaffling ? 'raffling' : 'ready');

  return (
    <div className="absolute left-150 top-0 h-full flex items-center">
      <button onClick={handlePull} disabled={isDisabled || isRaffling} className="outline-none focus:outline-none relative h-40 w-1">
        
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-gray-700 border-2 border-gray-500 rounded-b-lg"></div>
        
        <motion.div
          animate={{ rotate: isPulled ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 5 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 w-2 h-28 bg-gray-500 origin-bottom"
        >
          <motion.div 
            className="w-10 h-10 rounded-full border-4 border-gray-800 absolute -top-5 -left-4"
            animate={{
                backgroundColor: leverState === 'ready' ? '#f87171' : '#4b5563',
                boxShadow: leverState === 'ready' ? '0 0 15px #f87171' : 'none'
            }}
          />
        </motion.div>
      </button>
    </div>
  );
}

interface RaffleMachineProps {
    onRaffle: () => void;
    isRaffling: boolean;
    isDisabled: boolean;
    displayItem: string | null;
    isWinner: boolean;
}

export function RaffleMachine({ onRaffle, isRaffling, isDisabled, displayItem, isWinner }: RaffleMachineProps) {
    const winnerVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1.1, transition: { type: 'spring', delay: 0.2 } },
    } as const;

    return (
        <div className="relative w-full max-w-lg mx-auto mt-8 mb-4">
            <div className="bg-gray-800 border-4 custom-border rounded-2xl p-8 custom-shadow">
                <h3 className="text-center text-xl font-bold custom-text tracking-wider mb-4">
                    {isWinner ? 'GRANDE VENCEDOR!' : 'Aguardando Sorteio'}
                </h3>
                <div className="relative w-full h-36 flex items-center justify-center overflow-hidden bg-black/50 rounded-lg border-2 custom-border shadow-inner">
                    <AnimatePresence>
                        {!isWinner && displayItem && (
                            <motion.div
                                key={displayItem}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.1 }}
                                className="absolute text-3xl md:text-4xl font-bold text-center text-white"
                            >
                                {displayItem}
                            </motion.div>
                        )}
                        {isWinner && displayItem && (
                            <motion.div
                                key={`${displayItem}-winner`}
                                variants={winnerVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-4xl md:text-5xl font-extrabold bg-clip-text custom-text text-center"
                            >
                                {displayItem}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            <Lever onPull={onRaffle} isDisabled={isDisabled} isRaffling={isRaffling} />
        </div>
    );
}