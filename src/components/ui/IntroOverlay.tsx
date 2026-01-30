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
                    className="fixed inset-0 z-50 bg-[#f0f9ff] flex items-center justify-center overflow-hidden"
                >
                    <div className="w-full h-full relative">
                        <Canvas shadows camera={{ position: [0, 0, 7], fov: 40 }}>
                            <IntroScene onComplete={() => setSceneCompleted(true)} />
                        </Canvas>

                        {/* Minimal Overlay - The Box has the text! */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 3, duration: 1 }}
                            className="absolute bottom-10 w-full text-center pointer-events-none"
                        >
                            <p className="text-slate-400 font-light text-xs tracking-[0.5em] uppercase">
                                Explosive Softness
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
