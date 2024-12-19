import React, { useRef, useReducer, useMemo, useEffect } from 'react'
import Navbar from './Navbar'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Center, Float, Text3D } from '@react-three/drei'
import { BallCollider, Physics, RigidBody } from '@react-three/rapier'
import { easing } from 'maath'
import { Effects } from './Effects'

const accents = ['#ff4060', '#ffcc00', '#20ffa0', '#4060ff']

const baseProps = (accentColor) => ([
  { color: '#444', roughness: 0.1, metalness: 0.5 },
  { color: '#444', roughness: 0.1, metalness: 0.5 },
  { color: '#444', roughness: 0.1, metalness: 0.5 },
  { color: 'white', roughness: 0.1, metalness: 0.1 },
  { color: 'white', roughness: 0.1, metalness: 0.1 },
  { color: 'white', roughness: 0.1, metalness: 0.1 },
  { color: accentColor, roughness: 0.1, accent: true },
  { color: accentColor, roughness: 0.1, accent: true },
  { color: accentColor, roughness: 0.1, accent: true },
  { color: '#444', roughness: 0.1 },
  { color: '#444', roughness: 0.3 },
  { color: '#444', roughness: 0.3 },
  { color: 'white', roughness: 0.1 },
  { color: 'white', roughness: 0.2 },
  { color: 'white', roughness: 0.1 },
  { color: accentColor, roughness: 0.1, accent: true, transparent: true, opacity: 0.5 },
  { color: accentColor, roughness: 0.3, accent: true },
  { color: accentColor, roughness: 0.1, accent: true }
])

function shuffle(accent = 0, total = 50) {
  const patterns = baseProps(accents[accent])
  const spheres = []
  for (let i = 0; i < total; i++) {
    const p = { ...patterns[Math.floor(Math.random() * patterns.length)] }
    spheres.push(p)
  }
  return spheres
}

function Sphere({ position, children, vec = new THREE.Vector3(), r = THREE.MathUtils.randFloatSpread, color = 'white', ...props }) {
  const api = useRef()
  const ref = useRef()
  const pos = useMemo(() => position || [r(20), r(20), r(20)], [])
  useFrame((state, delta) => {
    delta = Math.min(0.1, delta)
    api.current?.applyImpulse(vec.copy(api.current.translation()).negate().multiplyScalar(0.2))
    easing.dampC(ref.current.material.color, color, 0.2, delta)
  })
  return (
    <RigidBody linearDamping={4} angularDamping={1} friction={0.1} position={pos} ref={api} colliders={false}>
      <BallCollider args={[1]} />
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial {...props} />
        {children}
      </mesh>
    </RigidBody>
  )
}

function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ mouse, viewport }) => ref.current?.setNextKinematicTranslation(vec.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0)))
  return (
    <RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  )
}

function HeroText() {
  return (
    <Center>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        {/* Single line of 3D text: "HI THERE I'M KHALIL" */}
        <Text3D
          font="/gt.json"
          size={1.5}           // Smaller size
          height={0.3}
          curveSegments={24}
          bevelEnabled
          bevelSize={0.05}
          bevelThickness={0.05}
          position={[5, 7, 25]} // Closer to the camera (z=10) and slightly above (y=5)
        >
          HI THERE 
          <meshStandardMaterial color="white" />
        </Text3D>
      </Float>
      
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        {/* Single line of 3D text: "HI THERE I'M KHALIL" */}
        <Text3D
          font="/gt.json"
          size={1.5}           // Smaller size
          height={0.3}
          curveSegments={24}
          bevelEnabled
          bevelSize={0.05}
          bevelThickness={0.05}
          position={[5, 4, 25]} // Closer to the camera (z=10) and slightly above (y=5)
        >
          I'M KHALIL 
          <meshStandardMaterial color="white" />
        </Text3D>
      </Float>
    </Center>
  )
}

const Header = () => {
  const [accent, click] = useReducer((state) => ++state % accents.length, 0)
  
  // Automatically change accent every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      click()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const connectors = useMemo(() => shuffle(accent, 50), [accent])

  return (
    <section className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Canvas as background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          flat
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: false }}
          camera={{ position: [0, 0, 30], fov: 17.5, near: 10, far: 40 }}
        >
          <color attach="background" args={['#141622']} />
          <Physics timeStep="vary" gravity={[0, 0, 0]}>
            <Pointer />
            {connectors.map((props, i) => (
              <Sphere key={i} {...props} />
            ))}
          </Physics>

          {/* 3D Text */}
          <HeroText />

          <Environment resolution={256}>
            <group rotation={[-Math.PI / 3, 0, 1]}>
              <Lightformer form="circle" intensity={100} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
              <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
              <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
              <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
              <Lightformer form="ring" color="#4060ff" intensity={80} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[10, 10, 0]} scale={10} />
            </group>
          </Environment>
          <Effects />
        </Canvas>
      </div>

      {/* Gradient Overlay above the Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10 pointer-events-none"></div>

      {/* Navbar above gradient */}
      <div className="relative z-20 pointer-events-none">
        <Navbar />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm z-20 pointer-events-none">
        <p className="tracking-widest mb-4">SCROLL</p>
        <div className="w-4 h-4 border-b-2 border-r-2 border-gray-400 transform rotate-45 animate-bounce"></div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-4 md:left-8 text-gray-400 text-xs z-20 pointer-events-none">
        <p>Based in Rabat, Morocco</p>
        <p>11:16 PM GMT+1 - 27.79°C</p>
      </div>
      <div className="absolute bottom-8 right-4 md:right-8 text-xs text-gray-400 z-20 pointer-events-none">
        <p>Freelance Availability</p>
        <p className="text-orange-500 uppercase font-semibold">● Limited Hours</p>
      </div>
    </section>
  )
}

export default Header
