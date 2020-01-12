import { Component } from 'react';
import { Scene } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const MODEL_URL = 'https://static.ihaveblog.ru/model/scene.gltf';

interface Props {
  scene: Scene;
  onLoad: () => void;
}

export default class House extends Component<Props> {
  componentDidMount() {
    const { scene, onLoad } = this.props;
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(MODEL_URL, (gltf) => {
      const root = gltf.scene;

      root.scale.set(0.01, 0.01, 0.01);
      root.translateY(1.8);

      // filterObj(gltf.scene);

      scene.add(root);

      onLoad();
    });
  }

  render(): null {
    return null;
  }
}
