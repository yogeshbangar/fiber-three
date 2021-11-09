import { useEffect, useRef, useMemo} from "react";
import {
  Canvas,
  useFrame,
} from "@react-three/fiber";
import * as THREE from "three";


function Lights() {
    const ref = useRef()
    useFrame(() => (ref.current.rotation.y = ref.current.rotation.z += 0.01))
    return (
      <group ref={ref}>
        <ambientLight intensity={0.5} />
        <directionalLight castShadow intensity={2} position={[30, 30, 50]} />
        <pointLight intensity={5} position={[0, 0, 0]} />
      </group>
    )
  }
  function Boxes({ material: Material = 'meshStandardMaterial', amount = 100, spread = 6, color, ...props }) {
    const mesh = useRef()
    const dummy = new THREE.Object3D()
    const rps = () => spread / 2 - Math.random() * spread
    const coords = useMemo(() => new Array(amount).fill().map(() => [rps(), rps(), rps()]), [amount])
    useEffect(state => {
      coords.forEach(([x, y, z], i) => {
        dummy.position.set(x, y, z)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      })
      mesh.current.instanceMatrix.needsUpdate = true
    }, [])
    return (
      <instancedMesh ref={mesh} args={[null, null, amount]} {...props} receiveShadow castShadow>
        <boxBufferGeometry attach="geometry" />
        <Material attach="material" color={color} roughness={1} />
      </instancedMesh>
    )
  }
  function Content() {
    const ref = useRef()
    useFrame(() => (ref.current.rotation.x = ref.current.rotation.y = ref.current.rotation.z += 0.005))
    return (
      <group ref={ref}>
        <Boxes amount={20} material="meshBasicMaterial" color="lightpink" />
        <Boxes amount={60} color="#575760" />
      </group>
    )
  }
export default function Anim3DEffect() {
  return (
    <Canvas
    style={{ position: "fixed" }}
    shadowMap
    colorManagement
    camera={{ position: [0, 0, 8], far: 15 }}
    onCreated={({ gl, camera }) => {
      gl.setClearColor(new THREE.Color('#373740'))
    }}>
      
      <Lights />
      <Content />
      
      {/* <Box position={[1.2, 0, 0]} /> */}
    </Canvas>
  );
}
