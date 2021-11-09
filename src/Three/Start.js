import { useEffect, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  SharedCanvasContext,
} from "@react-three/fiber";
import * as THREE from "three";
import { LightningStrike } from "three/examples/jsm/geometries/LightningStrike.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  const threeRef = useThree();

  const canGoBackwardsInTime = true,
    outlineEnabled = true;
  const lightningColor = new THREE.Color(0xb0ffff);
  const outlineColor = new THREE.Color(0x00ffff);
  let currentTime = 0;
  let lightningMaterial;
  const composer = new EffectComposer(threeRef.gl);
  composer.passes = [];
  composer.addPass(new RenderPass(threeRef.scene, threeRef.camera));

  let lightningStrikeMesh;
  const outlineMeshArray = [];

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
  };

  const lightningStrike = new LightningStrike(rayParams);

  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01;
    threeRef.camera.position.z = 100;
    currentTime += delta;
				if (currentTime < 0) {
					currentTime = 0;
				}
    render(delta);
  });
  // Return the view, these are regular Threejs elements expressed in JSX

  const createOutline = (objectsArray, visibleColor) => {
    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      threeRef.scene,
      threeRef.camera,
      objectsArray
    );
    outlinePass.edgeStrength = 2.5;
    outlinePass.edgeGlow = 0.7;
    outlinePass.edgeThickness = 2.8;
    outlinePass.visibleEdgeColor = visibleColor;
    outlinePass.hiddenEdgeColor.set(0);
    composer.addPass(outlinePass);
    return outlinePass;
  };
  const recreateRay = () => {
    lightningStrikeMesh = new THREE.Mesh(lightningStrike, lightningMaterial);
    outlineMeshArray.length = 0;
    outlineMeshArray.push(lightningStrikeMesh);

    threeRef.scene.add(lightningStrikeMesh);
    console.log(lightningStrikeMesh, "lightningStrike ", lightningStrike);
  };
  const render = (time) => {
    if (!composer) return;
    // lightningStrike.rayParameters.sourceOffset.x = -5;
    // lightningStrike.rayParameters.sourceOffset.y = 0;
    // lightningStrike.rayParameters.sourceOffset.z = 10;

    // lightningStrike.rayParameters.destOffset.x = 5;
    // lightningStrike.rayParameters.destOffset.y = 0;
    // lightningStrike.rayParameters.destOffset.z = 10;

    lightningStrike.update(time);

    if (outlineEnabled) {
      composer.render();
    } else {
      threeRef.renderer.render(threeRef.scene, threeRef.camera);
    }
  };
  useEffect(() => {
    console.log("recreateRay~~~~~~~~~a~~~~~~~", lightningStrike);
    recreateRay();
    createOutline(outlineMeshArray, outlineColor);
    console.log("recreateRay~~~~~~~~~~s~~~~~~", lightningStrike);
  }, []);

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function Anim3DBox() {
  return (
    <Canvas
      id="canvas-fiber"
      style={{ position: "fixed" }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      {/* <Box position={[1.2, 0, 0]} /> */}
    </Canvas>
  );
}
