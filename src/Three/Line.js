import { useRef, useEffect } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import * as THREE from "three";

const TIME_TRAVEL = 1000;
extend({ OrbitControls });
function Box(props) {
  const ref = useRef();
  const points = [];
  points.push(new THREE.Vector3(0.5, 0, 1.5));
  points.push(new THREE.Vector3(0.5, 0, 1.5));
  points.push(new THREE.Vector3(0.5, 0, 1.5));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const textureLoader = new THREE.TextureLoader();
  const textureRing = textureLoader.load(
    "https://hututusoftwares.com/images/team_02.jpg"
  );
  const textureDetail = textureLoader.load(
    "https://hututusoftwares.com/images/team_02.jpg"
  );
  textureRing.wrapS = textureRing.wrapT = THREE.RepeatWrapping;
  textureRing.repeat.x = 0.1;
  textureRing.offset.x = 100;
  useFrame((state, delta) => {
    if (textureRing && ref?.current?.scale) {
      if (textureRing.repeat.x < 1) {
        const result = ref?.current.children.find(
          ({ name }) => name === "detail"
        );
        textureRing.repeat.x += 0.01;
        if (result) result.scale.x = textureRing.repeat.x;
        if (textureRing.repeat.x > 1) {
          ref.current.scale.x = 1;
          textureRing.repeat.x = 1;
        }
      }
      const line = ref?.current.children.find(({ name }) => name === "line")
        ?.geometry?.attributes?.position;
      if (line) {
        line.array[0] = points[0].x;
        line.array[1] = points[0].y;
        line.array[2] = points[0].z;
        line.array[3] = points[1].x;
        line.array[4] = points[1].y;
        line.array[5] = points[1].z;
        line.array[6] = points[2].x;
        line.array[7] = points[2].y;
        line.array[8] = points[2].z;
        line.needsUpdate = true;
      }
    }
    TWEEN?.update();
  });

  const setLast = (lastPos) => {
    new TWEEN.Tween(points[2])
      .to(
        {
          x: lastPos.x,
          y: lastPos.y,
          z: lastPos.z,
        },
        TIME_TRAVEL
      )
      .onComplete(() => {
        console.log("onComplete");
      })
      .start();

    const showdetail = ref?.current.children.find(
      ({ name }) => name === "showdetail"
    );
    console.log("showdetail-> ", ref?.current);
    new TWEEN.Tween(showdetail.material)
      .to(
        {
          opacity: 1,
        },
        TIME_TRAVEL
      )
      .onComplete(() => {
        console.log("onComplete");
      })
      .start();
  };

  const setFocus = (centerPos, lastPos) => {
    console.log("setFocus", TWEEN);
    if (!TWEEN) return;
    new TWEEN.Tween(points[1])
      .to(
        {
          x: centerPos.x,
          y: centerPos.y,
          z: centerPos.z,
        },
        TIME_TRAVEL
      )
      .onComplete(() => {
        console.log("onComplete");
      })
      .start();
    new TWEEN.Tween(points[2])
      .to(
        {
          x: centerPos.x,
          y: centerPos.y,
          z: centerPos.z,
        },
        TIME_TRAVEL
      )
      .onComplete(() => {
        setLast(lastPos);
      })
      .start();
  };
  useEffect(() => {
    setFocus({ x: 1, y: 1, z: 1 }, { x: 3.6, y: 1, z: 1 });
  }, []);

  return (
    <group ref={ref}>
      <mesh scale={[0.1, 1, 1]} name={"detail"}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshStandardMaterial map={textureRing} attach="material" />
      </mesh>
      <mesh position={[2.3, 1.3, 1]} scale={[2, 0.5, 2]} name={"showdetail"}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshBasicMaterial
          map={textureDetail}
          attach="material"
          transparent={true}
          opacity={0}
        />
      </mesh>
      <line name={"line"}>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial color="red" linewidth={3} />
      </line>
    </group>
  );
}
function DrawLine({ start, end }) {
  const ref = useRef();
  const points = [];
  points.push(new THREE.Vector3(-0.5, 0, 1.5));
  points.push(new THREE.Vector3(1.5, 0.5, 1.5));
  points.push(new THREE.Vector3(-2.5, 0, -5));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  useFrame((state, delta) => {
    points[0].x++;
    ref.current.geometry.attributes.position.array[0] = points[0].x;
    // ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={ref}>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial color="hotpink" linewidth={1} />
    </line>
  );
}
const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  return <orbitControls args={[camera, domElement]} />;
};
export default function Line() {
  return (
    <Canvas
      id="canvas-fiber"
      style={{ position: "fixed" }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[0, 0, 0]} />
      <CameraControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box />
    </Canvas>
  );
}
