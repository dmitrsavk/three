import React, { Component } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

import { connect } from 'core';
import { PageProps, StoreDispatchProps, StoreProps, AuthPageState } from './types';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Mesh, Vector3 } from 'three';

class Room extends Component<PageProps, AuthPageState> {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  cube: Mesh;
  canvas: HTMLCanvasElement;

  constructor(props: PageProps) {
    super(props);

    this.renderScene = this.renderScene.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);

    this.init3D();

    this.addLight();
    this.addCube();

    this.renderScene();
  }

  init3D() {
    this.canvas = document.getElementById('room-page-canvas') as HTMLCanvasElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);

    this.camera.position.set(2, 0, 2);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
  }

  addLight() {
    const directionLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionLight.position.set(-1, 2, 4);
    this.scene.add(directionLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);
  }

  addCube() {
    const cubeSize = 1;
    const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#ff0303' });

    this.cube = new THREE.Mesh(cubeGeo, cubeMat);
    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);
  }

  onKeyPress = (event: any) => {
    if (event.keyCode == 39) {
      this.cube.rotateY(-3);
    } else if (event.keyCode == 37) {
      this.cube.rotateY(3);
    } else if (event.keyCode == 38) {
      this.cube.rotateX(-3);
    } else if (event.keyCode == 40) {
      this.cube.rotateX(3);
    }
  };

  needResize() {
    const pixelRatio = window.devicePixelRatio;
    const width = this.canvas.clientWidth * pixelRatio;
    const height = this.canvas.clientHeight * pixelRatio;

    const needResize = this.canvas.width !== width || this.canvas.height !== height;

    this.renderer.setSize(width, height, false);

    return needResize;
  }

  renderScene() {
    if (this.needResize()) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    requestAnimationFrame(this.renderScene);

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <Page>
        <Canvas id="room-page-canvas" />
      </Page>
    );
  }
}

const Page = styled.div`
  width: 100%;
  display: flex;
`;

const Canvas = styled.canvas`
  width: 100vw;
  height: 100vh;
`;

export default connect<StoreProps, StoreDispatchProps, any>(
  (state) => {
    return {};
  },
  (dispatch) => {
    return {};
  }
)(Room);
