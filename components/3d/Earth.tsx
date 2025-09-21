"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, AdditiveBlending, ShaderMaterial, Group, Mesh, Color } from "three";

function useFresnelMaterial() {
  const mat = useMemo(() => {
    const uniforms = {
      color1: { value: new Color(0x0088ff) },
      color2: { value: new Color(0x000000) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
    };

    const vs = `
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;
      varying float vReflectionFactor;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
        vec3 I = worldPosition.xyz - cameraPosition;
        vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fs = `
      uniform vec3 color1;
      uniform vec3 color2;
      varying float vReflectionFactor;
      void main() {
        float f = clamp( vReflectionFactor, 0.0, 1.0 );
        gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
      }
    `;

    const material = new ShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: AdditiveBlending,
    });

    return material;
  }, []);

  return mat;
}

export default function Earth() {
  const groupRef = useRef<Group>(null);
  const earthRef = useRef<Mesh>(null);
  const lightsRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  const [diffuse, specular, bump, lights, clouds, cloudsAlpha] = useLoader(TextureLoader, [
    "/textures/00_earthmap1k.jpg",
    "/textures/02_earthspec1k.jpg",
    "/textures/01_earthbump1k.jpg",
    "/textures/03_earthlights1k.jpg",
    "/textures/04_earthcloudmap.jpg",
    "/textures/05_earthcloudmaptrans.jpg",
  ]);

  const fresnelMat = useFresnelMaterial();

  useFrame((_, delta) => {
    if (groupRef.current) {
      // passive spin
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, -23.4 * Math.PI / 180]}>
      {/* Base earth */}
      <mesh ref={earthRef}>
        <icosahedronGeometry args={[1, 12]} />
        <meshPhongMaterial map={diffuse as any} specularMap={specular as any} bumpMap={bump as any} bumpScale={0.04} />
      </mesh>

      {/* Night lights overlay */}
      <mesh ref={lightsRef}>
        <icosahedronGeometry args={[1, 12]} />
        <meshBasicMaterial map={lights as any} blending={AdditiveBlending} transparent />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef} scale={[1.003, 1.003, 1.003]}>
        <icosahedronGeometry args={[1, 12]} />
        <meshStandardMaterial map={clouds as any} alphaMap={cloudsAlpha as any} transparent opacity={0.8} blending={AdditiveBlending} />
      </mesh>

      {/* Fresnel glow */}
      <mesh ref={glowRef} scale={[1.01, 1.01, 1.01]}>
        <icosahedronGeometry args={[1, 12]} />
        <primitive object={fresnelMat} attach="material" />
      </mesh>
    </group>
  );
}
