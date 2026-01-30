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
            // Wait a tiny bit for the fade out animation to start/finish before notifying parent
            const timer = setTimeout(() => {
                onIntroComplete();
            }, 1000); // 1s fade out duration
            return () => clearTimeout(timer);
        }
    }, [sceneCompleted, onIntroComplete]);

    return (
        <AnimatePresence>
            {!sceneCompleted && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                >
                    <div className="w-full h-full relative">
                        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                            <IntroScene onComplete={() => setSceneCompleted(true)} />
                        </Canvas>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute bottom-20 left-0 right-0 text-center pointer-events-none"
                        >
                            <h2 className="text-white font-serif text-3xl tracking-widest uppercase opacity-90 mb-2">Hanky Tales</h2>
                            <p className="text-white/80 text-lg tracking-wider font-light italic">"Got an issue? Get a tissue!"</p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
