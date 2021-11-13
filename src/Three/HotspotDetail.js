import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import * as THREE from "three";

const TIME_TRAVEL = 1000;
extend({ OrbitControls });
function Box({ hotPosition }) {
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
        line.array[0] = hotPosition[0];
        line.array[1] = hotPosition[1];
        line.array[2] = hotPosition[2];
        line.array[3] = hotPosition[0];
        line.array[4] = hotPosition[1];
        line.array[5] = hotPosition[2];
        // line.array[6] = points[2].x;
        // line.array[7] = points[2].y;
        // line.array[8] = points[2].z;
        line.needsUpdate = true;
      }

      const hotspot = ref?.current.children.find(({ name }) => name === "hotspot");
      if(hotspot){
        
        hotspot.position.x = hotPosition[0];
        hotspot.position.y = hotPosition[1];
        hotspot.position.z = hotPosition[2];
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
          opacity={1}
        />
      </mesh>
      <line name={"line"}>
        <bufferGeometry attach="geometry" {...lineGeometry} />
        <lineBasicMaterial color="red" linewidth={3} />
      </line>
      <mesh scale={[0.1, 0.1, 0.1]} position={[0.5, 0.5, 0.5]} name="hotspot">
        <boxGeometry />
        <meshBasicMaterial color="yellow" />
      </mesh>
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
function DrawCube({ setHotPosition }) {
  const ref = useRef();
  const threeRef = useThree();
  const getPointInBetweenByLen = (pointA, pointB, length) => {
    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);
  };
  const getPointInBetweenByPerc=(pointA, pointB, percentage)=>{

    var dir = pointB.clone().sub(pointA);
    var len = dir.length();
    dir = dir.normalize().multiplyScalar(len*percentage);
    return pointA.clone().add(dir);

}
  useFrame((state, delta) => {
    if (!ref?.current || !threeRef.camera) return;
    const hotspot = ref?.current?.children.find(
      ({ name }) => name === "hotspot"
    );
    if (ref?.current?.rotation) {
      // ref.current.rotation.x += 0.001;
      // ref.current.rotation.y += 0.001;
      // ref.current.rotation.z += 0.001;
    }

    const pos = new THREE.Vector3();
    hotspot?.getWorldPosition(pos);

    // const distanceFromCamera = 4; // 3 units
    // const target = new THREE.Vector3(0, 0, -distanceFromCamera);
    // target.applyMatrix4(threeRef.camera.matrixWorld);
    // pos.lerp(target, 1.1);
    // const newPos = getPointInBetweenByPerc(pos, threeRef.camera.position, .1);
    
    // console.log(threeRef.camera.position)
    // threeRef.camera.position.x =0;
    // threeRef.camera.position.y =0;
    // threeRef.camera.position.z =5;


    const cwd = new THREE.Vector3();
    threeRef.camera.getWorldDirection(cwd);
    cwd.multiplyScalar(3);
    cwd.add(threeRef.camera.position);



    const val = pos.clone().sub(threeRef.camera.position);
    pos.x -= val.x/2;
    pos.y -= val.y/2;
    pos.z -= val.z/2;
    // console.log(pos,val);
    // cwd.add(pos);
    setHotPosition([pos.x, pos.y, pos.z]);
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry />
        <meshPhongMaterial color="green" />
      </mesh>
      <mesh scale={[0.05, 0.05, 0.1]} position={[0.5, 0.5, 0.5]} name="hotspot">
        <sphereGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  return <orbitControls args={[camera, domElement]} />;
};
export default function HotspotDetail() {
  const [hotPosition, setHotPosition] = useState([0, 0, 0]);
  return (
    <Canvas
      id="canvas-fiber"
      style={{ position: "fixed" }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[0, 0, 0]} />
      <CameraControls/>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <DrawCube setHotPosition={setHotPosition} />
      <Box hotPosition={hotPosition} />
    </Canvas>
  );
}
