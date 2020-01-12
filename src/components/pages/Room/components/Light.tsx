import { Component } from 'react';
import { PointLight, DirectionalLight, PointLightHelper, Scene, AmbientLight } from 'three';

interface Props {
  scene: Scene;
}

export default class Light extends Component<Props> {
  componentDidMount() {
    this.addAmbient();
    this.addDirectional();
    this.addPoint();
  }

  addPoint() {
    const { scene } = this.props;

    const p = new PointLight(0xffffff, 1, 5);
    p.position.set(0, 4.8, 0);

    const p1 = new PointLight(0xffffff, 1, 5);
    p1.position.set(-4.8, 4.3, 0.5);

    const p2 = new PointLight(0xffffff, 1, 5);
    p2.position.set(-1.8, 5, 0.5);

    const p3 = new PointLight(0xffffff, 1, 5);
    p3.position.set(-3.6, 4.8, 0.5);

    const nearSofa = new PointLight(0xffffff, 1, 5);
    nearSofa.position.set(0, 1.8, 1.5);

    const k1 = new PointLight(0xffffff, 1, 5);
    k1.position.set(3, 2.5, -1.2);

    const k2 = new PointLight(0xffffff, 1, 5);
    k2.position.set(2, 2.5, -1.2);

    // scene.add(p);
    // scene.add(p1);
    // scene.add(p2);
    // scene.add(p3);
    scene.add(nearSofa);
    scene.add(k1);
    scene.add(k2);

    // const pHelper = new PointLightHelper(k2, 0.1);
    // scene.add(pHelper);
  }

  addAmbient() {
    const { scene } = this.props;

    const light = new AmbientLight(0xffffff, 0.5);

    scene.add(light);
  }

  addDirectional() {
    const { scene } = this.props;

    const light = new DirectionalLight(0xffffff, 0.5);

    light.position.set(0, 5, 0);
    light.target.position.set(0, 0, 0);

    scene.add(light);
  }

  render(): null {
    return null;
  }
}
