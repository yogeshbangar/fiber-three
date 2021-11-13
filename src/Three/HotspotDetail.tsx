import { useRef, useEffect } from 'react';
// import { useFrame } from 'react-three-fiber';
// import * as THREE from 'three';
// import { Mesh } from 'three';

const TIME_TRAVEL = 1000;

export default function HotspotDetail() {
  const ref = useRef();
  // const points = [];
  // points.push(new THREE.Vector3(-10.5, 0, -1.5));
  // points.push(new THREE.Vector3(-0.5, -1, -1.5));
  // points.push(new THREE.Vector3(1.5, 0, -15));
  // const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  // const textureLoader = new THREE.TextureLoader();
  // useEffect(() => {
  //   const detailMesh:Mesh = ref?.current;
  //   const textureDetail = textureLoader.load(
  //     'https://hututusoftwares.com/images/team_02.jpg'
  //   );
  //   const showdetail = detailMesh.children.find(
  //     ({ name }) => name === 'showdetail'
  //   )?.['material'];
  // }, []);

  return (
    <group ref={ref}>
      <mesh position={[2.3, 1.3, -1]} scale={[2, 2.5, 2]} name={'showdetail'}>
        <planeGeometry attach="geometry" args={[1.0, 1.0]} />
        <meshBasicMaterial attach="material" />
      </mesh>
      {/* <line name={'line'}>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial attach="material" color="green" linewidth={30} />
      </line> */}
    </group>
  );
}
