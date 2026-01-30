'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingTissue() {
    const meshRef = useRef<THREE.Mesh>(null);

    // Create geometry with enough segments for smooth wave animation
    const geometry = useMemo(() => new THREE.PlaneGeometry(3, 3, 32, 32), []);

    // Store original positions for wave calculation
    const originalPositions = useMemo(() => {
        return geometry.attributes.position.array.slice();
    }, [geometry]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (meshRef.current) {
            // Gentle floating rotation
            meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1 + Math.PI / 4;
            meshRef.current.rotation.y = Math.sin(time * 0.15) * 0.1;
            meshRef.current.position.y = Math.sin(time * 0.5) * 0.2;

            // Wave animation on vertices
            const positions = meshRef.current.geometry.attributes.position;
            const count = positions.count;

            for (let i = 0; i < count; i++) {
                const x = originalPositions[i * 3];
                const y = originalPositions[i * 3 + 1];
                // const z = originalPositions[i * 3 + 2]; // original z is 0 for plane

                // Create wave effect based on x and y coordinates + time
                // Multi-frequency wave for more natural cloth look
                const waveX = Math.sin(x * 1.5 + time * 1.2) * 0.2;
                const waveY = Math.sin(y * 2.0 + time * 1.5) * 0.15;
                const waveZ = Math.sin((x + y) * 1.0 + time * 0.8) * 0.1;

                positions.setZ(i, waveX + waveY + waveZ);
            }

            positions.needsUpdate = true;

            // Update normals for correct lighting
            meshRef.current.geometry.computeVertexNormals();
        }
    });

    // Create Text Texture
    const texture = useMemo(() => {
        if (typeof document === 'undefined') return null;

        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.0)'; // Transparent
        ctx.fillRect(0, 0, 1024, 1024);

        // Text Config
        ctx.fillStyle = '#1e293b'; // Slate-800
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 1. Heading
        ctx.font = 'bold 60px "Inter", sans-serif';
        ctx.fillText("A Note of Gratitude", 512, 200);

        // 2. Body Paragraph
        ctx.font = '40px "Inter", sans-serif';
        const text = "Thank you for choosing Hanky Tales. We crafted this softness with care, hoping to bring comfort to your everyday moments. Every touch tells a story, and we are honored to be part of yours.";

        // Simple Word Wrap
        const words = text.split(' ');
        let line = '';
        let y = 350;
        const lineHeight = 60;
        const maxWidth = 800;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, 512, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        ctx.fillText(line, 512, y);

        // 3. Signature
        y += 150;
        ctx.font = 'italic 50px serif';
        ctx.fillText("With softness,", 512, y);
        y += 70;
        ctx.font = 'italic bold 60px serif'; // Signature style
        ctx.fillText("Ana Osthwal", 512, y);

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 16;
        return tex;
    }, []);

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshStandardMaterial
                color="#ffffff"
                map={texture}
                side={THREE.DoubleSide}
                roughness={0.6}
                metalness={0.1}
                transparent
                opacity={1.0}
            />
        </mesh>
    );
}
