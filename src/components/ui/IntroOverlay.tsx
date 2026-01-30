'use client';

import { Canvas } from '@react-three/fiber';
import { IntroScene } from '../3d/IntroScene';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface IntroOverlayProps {
    onIntroComplete: () => void;
}

export function IntroOverlay({ onIntroComplete }: IntroOverlayProps) {
    const [sceneCompleted, setSceneCompleted] = useState(false);
    const [textStage, setTextStage] = useState<'micro' | 'macro'>('micro');

    useEffect(() => {
        // 0-2.0s: Micro/Engineering view
        // 2.0s+: Macro/Product view
        const timer = setTimeout(() => {
            setTextStage('macro');
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (sceneCompleted) {
            const timer = setTimeout(() => {
                onIntroComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [sceneCompleted, onIntroComplete]);

    return (
        <AnimatePresence>
            {!sceneCompleted && (
                <motion.div
                    key="overlay"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
                >
                    <div className="w-full h-full relative">
                        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                            <IntroScene onComplete={() => setSceneCompleted(true)} />
                        </Canvas>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <AnimatePresence mode="wait">
                                {textStage === 'micro' ? (
                                    <motion.div
                                        key="micro"
                                        initial={{ opacity: 0, scale: 2 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <h2 className="text-cyan-200 font-mono text-xl tracking-[0.5em] uppercase text-center opacity-80 border-b border-cyan-500/30 pb-2">
                                            Micro-Woven Tech
                                        </h2>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="macro"
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 1.0, ease: "easeOut" }}
                                    >
                                        <h2 className="text-white font-serif text-5xl md:text-7xl tracking-wide italic text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                                            Get a tissue!
                                        </h2>
                                        <p className="text-white/60 text-center mt-4 text-sm tracking-[0.3em] uppercase">Engineered Softness</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
