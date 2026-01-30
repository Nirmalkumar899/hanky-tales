'use client';

import { Canvas } from '@react-three/fiber';
import { IntroScene } from '../3d/IntroScene'; // Ensure correct path
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface IntroOverlayProps {
    onIntroComplete: () => void;
}

export function IntroOverlay({ onIntroComplete }: IntroOverlayProps) {
    const [sceneCompleted, setSceneCompleted] = useState(false);
    const [textStage, setTextStage] = useState<'issue' | 'tissue'>('issue');

    useEffect(() => {
        // Sync text with the 3D animation timing
        // 0-1.5s: Issue
        // 1.5s+: Tissue
        const timer = setTimeout(() => {
            setTextStage('tissue');
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (sceneCompleted) {
            const timer = setTimeout(() => {
                onIntroComplete();
            }, 500); // Quick fade out after animation ends
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
                        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                            <IntroScene onComplete={() => setSceneCompleted(true)} />
                        </Canvas>

                        {/* Centered Text Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <AnimatePresence mode="wait">
                                {textStage === 'issue' ? (
                                    <motion.div
                                        key="issue"
                                        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                                        transition={{ duration: 0.2 }} // Fast, punchy transition
                                    >
                                        <h2 className="text-white text-5xl md:text-7xl font-bold tracking-tighter uppercase text-center" style={{ textShadow: "0 0 10px rgba(255,0,0,0.5)" }}>
                                            Got an Issue?
                                        </h2>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="tissue"
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 1.0, ease: "easeOut" }}
                                    >
                                        <h2 className="text-white font-serif text-5xl md:text-7xl tracking-wide italic text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                                            Get a Hanky.
                                        </h2>
                                        <p className="text-white/60 text-center mt-4 text-sm tracking-[0.3em] uppercase">Experience Softness</p>
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
