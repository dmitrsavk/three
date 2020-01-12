import { Component } from 'react';
import { PointLight, DirectionalLight, PointLightHelper, Scene } from 'three';

interface Props {
  scene: Scene;
}

export default class Light extends Component<Props> {
  componentDidMount() {
    const { scene } = this.props;
    const p = new PointLight(0xffffff, 1, 5);
    p.position.set(4, 2, 0);

    const p1 = new PointLight(0xffffff, 1, 5);
    p1.position.set(-4, 2, 0);

    const d = new DirectionalLight(0xffffff, 1);
    d.position.set(0, 5, 0);
    d.target.position.set(0, 0, 0);

    scene.add(p);
    scene.add(p1);
    scene.add(d);

    // var helper = new DirectionalLightHelper( d, 5 );
    // scene.add(helper)

    const pHelper = new PointLightHelper(p, 0.1);
    scene.add(pHelper);

    const p1Helper = new PointLightHelper(p1, 0.1);
    scene.add(p1Helper);
  }

  render(): null {
    return null;
  }
}
