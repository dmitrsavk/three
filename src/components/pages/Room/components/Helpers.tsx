import { Component } from 'react';
import { PointLight, DirectionalLight, PointLightHelper, Scene, GridHelper, AxesHelper } from 'three';

interface Props {
  scene: Scene;
}

export default class Helpers extends Component<Props> {
  componentDidMount() {
    const { scene } = this.props;

    const grid = new GridHelper(100, 100);
    const axes = new AxesHelper(6);

    axes.renderOrder = 1;
    //@ts-ignore
    axes.material.depthTest = false;

    grid.renderOrder = 1;

    scene.add(grid);
    scene.add(axes);
  }

  render(): null {
    return null;
  }
}
