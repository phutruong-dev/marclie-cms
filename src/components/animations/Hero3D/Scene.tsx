'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import React, { useRef } from 'react'
import type { Mesh } from 'three'

import { useReducedMotion } from '../useReducedMotion'

function Blob({ animate }: { animate: boolean }) {
  const mesh = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (animate && mesh.current) {
      mesh.current.rotation.y += delta * 0.25
      mesh.current.rotation.x += delta * 0.1
    }
  })

  return (
    <Float speed={animate ? 1.5 : 0} rotationIntensity={animate ? 0.5 : 0} floatIntensity={1}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.4, 16]} />
        <MeshDistortMaterial
          color="#6366f1"
          roughness={0.2}
          metalness={0.4}
          distort={animate ? 0.35 : 0.1}
          speed={animate ? 1.8 : 0}
        />
      </mesh>
    </Float>
  )
}

/**
 * Animated 3D hero placeholder (an iridescent distorted icosahedron).
 *
 * This is the actual WebGL scene — it must only ever be loaded on the client.
 * Use the `Hero3D` wrapper (`../Hero3D`) which lazy-loads it via `next/dynamic`
 * with `ssr: false`; do not import this file directly into server components.
 *
 * Respects `prefers-reduced-motion`: rotation, float and distortion freeze.
 */
export default function Scene() {
  const reduced = useReducedMotion()
  const animate = !reduced

  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} />
      <directionalLight position={[-3, -2, -3]} intensity={0.4} color="#a855f7" />
      <Blob animate={animate} />
    </Canvas>
  )
}
