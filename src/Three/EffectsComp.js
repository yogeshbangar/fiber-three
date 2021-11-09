import * as THREE from "three";
import { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";

import { LightningStrike } from "three/examples/jsm/geometries/LightningStrike.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

extend({
  LightningStrike,
  EffectComposer,
  ShaderPass,
  RenderPass,
  UnrealBloomPass,
  SSAOPass,
});

function Effects() {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  );
  useFrame(() => composer.current.render(), 1);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <sSAOPass
        attachArray="passes"
        args={[scene, camera, 1024, 1024]}
        kernelRadius={0.8}
        maxDistance={0.4}
      />
      <unrealBloomPass attachArray="passes" args={[undefined, 1.6, 1, 0.5]} />
      <shaderPass
        attachArray="passes"
        args={[FXAAShader]}
        material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
      />
    </effectComposer>
  );
}
function Lights() {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y = ref.current.rotation.z += 0.01));
  return (
    <group ref={ref}>
      <ambientLight intensity={0.5} />
      <directionalLight castShadow intensity={2} position={[30, 30, 50]} />
      <pointLight intensity={5} position={[0, 0, 0]} />
    </group>
  );
}

const SSPHotspot = ()=>{
    const rayParams = {
        sourceOffset: {
            x: 316.461379105263,
            y: 1100,
            z: 509.75699655305857,
        },
        destOffset: {
            x: -998.3435872277743,
            y: 200,
            z: 0,
        },
        radius0: 4,
        radius1: 4,
        minRadius: 2.5,
        maxIterations: 7,
        isEternal: true,
        timeScale: 0.7,
        propagationTimeFactor: 0.05,
        vanishingTimeFactor: 0.95,
        subrayPeriod: 3.5,
        subrayDutyCycle: 0.6,
        maxSubrayRecursion: 3,
        ramification: 7,
        recursionProbability: 0.6,
        roughness: 0.85,
        straightness: 0.6,
        up0: {
            x: 0,
            y: 0,
            z: 1,
        },
        up1: {
            x: 0,
            y: 0,
            z: 1,
        },
        radius0Factor: 0.5,
        radius1Factor: 0.2,
        isStatic: false,
        generateUVs: false,
        maxSubrays: 50,
    }
    return (
      <mesh>
        <lightningStrike
        args = {rayParams}
        />
        <meshBasicMaterial color="white"/>
      </mesh>
    );
  };
function Boxes({
  material: Material = "meshStandardMaterial",
  amount = 100,
  spread = 6,
  color,
  ...props
}) {
  const mesh = useRef();
  const dummy = new THREE.Object3D();
  const rps = () => spread / 2 - Math.random() * spread;
  const coords = useMemo(
    () => new Array(amount).fill().map(() => [rps(), rps(), rps()]),
    [amount]
  );
  useEffect((state) => {
    coords.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, amount]}
      {...props}
      receiveShadow
      castShadow
    >
      <boxBufferGeometry attach="geometry" />
      <Material attach="material" color={color} roughness={1} />
    </instancedMesh>
  );
}
function Content() {
  const ref = useRef();
  useFrame(
    () =>
      (ref.current.rotation.x =
        ref.current.rotation.y =
        ref.current.rotation.z +=
          0.005)
  );
  return (
    <group ref={ref}>
      <Boxes amount={20} material="meshBasicMaterial" color="lightpink" />
      <Boxes amount={60} color="#575760" />
    </group>
  );
}
export default function EffectsComp() {
  return (
    <Canvas
      style={{ position: "fixed" }}
      camera={{ position: [0, 0, 100], fov: 55, near: 1, far: 20000 }}
    >
      <Lights />
      <Content />
      
      <Suspense fallback={null}>
      
        <Effects />
      </Suspense>
    </Canvas>
  );
}
