import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import LineEffect from "./LineEffect";

function Box(props) {
  const ref = useRef();
  const threeRef = useThree();
  const textureLoader = new THREE.TextureLoader();
  const textureRing = textureLoader.load(
    "https://hututusoftwares.com/images/team_02.jpg"
  );
  textureRing.wrapS = textureRing.wrapT = THREE.RepeatWrapping;
  textureRing.repeat.x = 0.1;
  textureRing.offset.x = 100;
  useFrame((state, delta) => {
    if (textureRing&& ref?.current?.scale) {
        // 
      if (textureRing.repeat.x < 1) {
        textureRing.repeat.x += .01;
        ref.current.scale.x=textureRing.repeat.x;
        if(textureRing.repeat.x>1){
            ref.current.scale.x = 1;
            textureRing.repeat.x = 1;
        }
      }
    }
  });
  return (
    <mesh ref={ref} scale={[0.1,1,1]}>
      <boxGeometry args={[1.0, 1.0, 1.0]} />
      <meshStandardMaterial map={textureRing} attach="material" />
    </mesh>
  );
}
function DrawLine({ start, end }) {
  const ref = useRef();

  const points = [];
  points.push(new THREE.Vector3(-0.5, 0, 1.5));
  points.push(new THREE.Vector3(0.5, 0.5, 1.5));
  points.push(new THREE.Vector3(0.5, 0, -105));
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints(points);
  }, []);

  useFrame((state, delta) => {
    if (ref?.current?.rotation) {
    //   ref.current.geometry.attributes.position.array[0] += 0.01;
    //   ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="hotpink" linewidth={1} />
    </line>
  );
}

export default function Line() {
  return (
    <Canvas
      id="canvas-fiber"
      style={{ position: "fixed" }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box />
      <DrawLine start={[0, 0, 0]} end={[1, 0, 0]} />
    </Canvas>
  );
}
