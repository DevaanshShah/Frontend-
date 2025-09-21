"use client";

import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";

export default function Starfield({ numStars = 2000 }: { numStars?: number }) {
  const { positions, colors } = useMemo(() => {
    function randomSpherePoint() {
      const radius = Math.random() * 25 + 25;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      return { x, y, z, hue: 0.6 };
    }

    const verts: number[] = [];
    const cols: number[] = [];
    for (let i = 0; i < numStars; i++) {
      const p = randomSpherePoint();
      const col = new THREE.Color().setHSL(p.hue, 0.2, Math.random());
      verts.push(p.x, p.y, p.z);
      cols.push(col.r, col.g, col.b);
    }
    return {
      positions: new Float32Array(verts),
      colors: new Float32Array(cols),
    };
  }, [numStars]);

  const sprite = useLoader(TextureLoader, "/textures/stars/circle.png");

  return (
    <points rotation={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.2} vertexColors map={sprite as any} transparent />
    </points>
  );
}
