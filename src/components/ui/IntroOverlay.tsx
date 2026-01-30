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
    const [textStage, setTextStage] = useState<'issue' | 'tissue'>('issue');

    useEffect(() => {
        // Sync with Flash animation timeline (Total 1s)
        // 0s-0.2s: Issue
        // 0.2s: Transition start
        // 0.4s: Change text to "Tissue"
        const timer = setTimeout(() => {
            setTextStage('tissue');
        }, 400);

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
                    transition={{ duration: 1.0 }}
                    className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden"
                >
                    <div className="w-full h-full relative">
                        <Canvas shadows camera={{ position: [0, 0, 5], fov: 60 }}>
                            <IntroScene onComplete={() => setSceneCompleted(true)} />
                        </Canvas>

                        {/* Centered Text Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <AnimatePresence mode="wait">
                                {textStage === 'issue' ? (
                                    <motion.h1
                                        key="issue"
                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                            x: [0, -2, 2, -2, 2, 0], // Shake effect
                                        }}
                                        exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                                        transition={{ duration: 0.5 }}
                                        className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter"
                                    >
                                        GOT AN ISSUE?
                                    </motion.h1>
                                ) : (
                                    <motion.div
                                        key="tissue"
                                        className="text-center"
                                        initial={{ opacity: 0, filter: "blur(20px)" }}
                                        animate={{ opacity: 1, filter: "blur(0px)" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    >
                                        <h1 className="text-5xl md:text-7xl font-light text-slate-900 tracking-wide mb-2">
                                            Get a tissue.
                                        </h1>
                                        <p className="text-slate-400 text-sm tracking-[0.5em] uppercase">
                                            Hanky Tales
                                        </p>
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
