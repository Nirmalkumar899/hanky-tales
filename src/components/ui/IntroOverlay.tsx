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
                    transition={{ duration: 1.0 }}
                    className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
                >
                    <div className="w-full h-full relative">
                        <Canvas shadows camera={{ position: [0, 0, 8], fov: 60 }}>
                            <IntroScene onComplete={() => setSceneCompleted(true)} />
                        </Canvas>

                        {/* Minimal Overlay Text */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute bottom-10 w-full text-center pointer-events-none"
                        >
                            <h2 className="text-cyan-400 font-bold text-sm tracking-[0.5em] uppercase drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                                Infinite Softness
                            </h2>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
