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
    const [textState, setTextState] = useState<'issue' | 'hero' | 'resolution'>('issue');

    useEffect(() => {
        // 0s: Issue
        // 3.0s: Resolution
        const timer1 = setTimeout(() => setTextState('resolution'), 3000);

        return () => {
            clearTimeout(timer1);
        };
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
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-50 bg-[#F0F4F8] flex items-center justify-center overflow-hidden"
                >
                    <div className="w-full h-full relative">
                        <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }}>
                            <IntroScene onComplete={() => setSceneCompleted(true)} />
                        </Canvas>

                        {/* Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <AnimatePresence mode="wait">
                                {textState === 'issue' && (
                                    <motion.div
                                        key="issue"
                                        initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                                        animate={{
                                            opacity: 1,
                                            scale: [1, 1.1, 1],
                                            rotate: [-5, 5, -5, 0],
                                            x: [0, -5, 5, 0] // Shake
                                        }}
                                        exit={{ opacity: 0, scale: 0, rotate: 20 }}
                                        transition={{ duration: 0.5 }}
                                        className="mb-40"
                                    >
                                        <h1 className="text-6xl md:text-8xl font-black text-red-600 tracking-tighter uppercase drop-shadow-xl" style={{ textShadow: "4px 4px 0px #000" }}>
                                            GOT AN ISSUE?
                                        </h1>
                                    </motion.div>
                                )}

                                {textState === 'resolution' && (
                                    <motion.div
                                        key="resolution"
                                        initial={{ opacity: 0, scale: 0.2, y: 100 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ type: "spring", bounce: 0.6 }}
                                        className="mt-40"
                                    >
                                        <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 tracking-tighter uppercase drop-shadow-2xl" style={{ filter: "drop-shadow(4px 4px 0px rgba(0,0,0,0.2))" }}>
                                            GET A TISSUE!
                                        </h1>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-stone-500 font-bold text-xl text-center mt-4 tracking-widest uppercase"
                                        >
                                            Softness Saves the Day
                                        </motion.p>
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
