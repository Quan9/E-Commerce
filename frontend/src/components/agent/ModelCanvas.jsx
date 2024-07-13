import { Canvas, useLoader } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  Preload,
  TransformControls,
  useGLTF,
} from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Suspense } from "react";
const Model = ({ fileType, model }) => {
  let sample;
  switch (fileType) {
    case "obj":
      sample = useLoader(OBJLoader, model);
      break;
    case "gltf":
      sample = useGLTF(GLTFLoader, model);

      break;
    default:
      break;
  }
  return <primitive object={fileType === "gltf" ? sample.scene : sample} />;
};
const ModelCanvas = ({ model }) => {
  const type = model.name.split(".");
  const fileType = type[type.length - 1];
  const sampleURL = URL.createObjectURL(model);
  return (
    <Canvas camera={{ position: [20, 3, 5], fov: 30 }}>
      <OrbitControls />
      <Suspense fallback={null}>
        <Model model={sampleURL} fileType={fileType} />
      </Suspense>
    </Canvas>
  );
};

export default ModelCanvas;
