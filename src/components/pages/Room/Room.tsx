import React, { Component } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

import { connect } from 'core';
import { PageProps, StoreDispatchProps, StoreProps, PageState } from './types';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import Light from './components/Light';
import House from './components/House';
import Helpers from './components/Helpers';

const STEP_SIZE = 0.05;

const BLACK_LIST: string[] = [
  // 'window',
  // 'stairs',
  // 'couch',
  // 'chair',
  // 'Shelf',
  // 'bed',
  // 'lamp',
  // 'switches',
  // 'shopping',
  // 'plates',
];

class Room extends Component<PageProps, PageState> {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  canvas: HTMLCanvasElement;
  controls: any;
  moveForward: boolean;
  moveLeft: boolean;
  moveBackward: boolean;
  moveRight: boolean;

  state: PageState = {
    loading: true,
    onboarding: false,
    init: false,
  };

  constructor(props: PageProps) {
    super(props);

    this.renderScene = this.renderScene.bind(this);
  }

  componentDidMount() {
    this.init3D();

    this.initControls();

    this.setState({ init: true });
  }

  onHouseLoad = () => {
    console.log(this);
    this.setState({ loading: false, onboarding: true });

    this.renderScene();
  }

  init3D() {
    this.canvas = document.getElementById('room-page-canvas') as HTMLCanvasElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 100);

    this.camera.position.set(0, 1.8, 0);

    this.camera.rotation.order = 'YXZ';

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });

    // @ts-ignore
    document.addEventListener('keydown', this.onKeyDown);
    // @ts-ignore
    document.addEventListener('keyup', this.onKeyUp);
  }

  needResize() {
    const pixelRatio = window.devicePixelRatio;
    // const pixelRatio = 1;
    const width = this.canvas.clientWidth * pixelRatio;
    const height = this.canvas.clientHeight * pixelRatio;

    const needResize = this.canvas.width !== width || this.canvas.height !== height;

    this.renderer.setSize(width, height, false);

    return needResize;
  }

  onKeyDown = (event: React.KeyboardEvent<Document>) => {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;
      case 37: // left
      case 65: // a
        this.moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        this.moveRight = true;
        break;
    }
  };

  onKeyUp = (event: React.KeyboardEvent<Document>) => {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = false;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = false;
        break;
    }
  };

  renderScene() {
    if (this.needResize()) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    this.updateCameraPosition();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.renderScene);
  }

  onOnboardingClick = () => {
    this.setState({ onboarding: false });

    this.controls.lock();
  };

  initControls() {
    this.controls = new PointerLockControls(this.camera, document.body);

    this.scene.add(this.controls.getObject());

    this.controls.addEventListener('lock', () => {
      this.setState({ onboarding: false });
    });

    this.controls.addEventListener('unlock', () => {
      this.setState({ onboarding: true });
    });
  }

  updateCameraPosition() {
    if (this.moveBackward) {
      this.controls.moveForward(-STEP_SIZE);
    }

    if (this.moveForward) {
      this.controls.moveForward(STEP_SIZE);
    }

    if (this.moveLeft) {
      this.controls.moveRight(-STEP_SIZE);
    }

    if (this.moveRight) {
      this.controls.moveRight(STEP_SIZE);
    }
  }

  render() {
    const { loading, onboarding, init } = this.state;

    return (
      <Page>
        <Canvas id="room-page-canvas" pLoading={loading} />

        {init && (
          <>
            <Light scene={this.scene} />
            <House scene={this.scene} onLoad={this.onHouseLoad} />
            <Helpers scene={this.scene} />
          </>
        )}

        {loading && (
          <Loader>
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            <Info>Загрузка файлов...</Info>
          </Loader>
        )}

        {onboarding && (
          <Onboarding onClick={this.onOnboardingClick}>
            <h3>Клик мышью для старта</h3>
            <h4>Передвигаться: WASD</h4>
          </Onboarding>
        )}
      </Page>
    );
  }
}

const Page = styled.div`
  width: 100%;
  display: flex;
`;

const Canvas = styled.canvas<{ pLoading: boolean }>`
  width: 100vw;
  height: 100vh;
  background: ${(p) => (p.pLoading ? '#000' : 'linear-gradient(135deg, rgb(246, 85, 153) 0%, rgb(77, 3, 22) 100%)')};
  background-size: cover;
  background-repeat: no-repeat;
`;

const Onboarding = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
`;

const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  .lds-roller {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
  }
  .lds-roller div:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    margin: -4px 0 0 -4px;
  }
  .lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
  }
  .lds-roller div:nth-child(1):after {
    top: 63px;
    left: 63px;
  }
  .lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
  }
  .lds-roller div:nth-child(2):after {
    top: 68px;
    left: 56px;
  }
  .lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
  }
  .lds-roller div:nth-child(3):after {
    top: 71px;
    left: 48px;
  }
  .lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
  }
  .lds-roller div:nth-child(4):after {
    top: 72px;
    left: 40px;
  }
  .lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
  }
  .lds-roller div:nth-child(5):after {
    top: 71px;
    left: 32px;
  }
  .lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
  }
  .lds-roller div:nth-child(6):after {
    top: 68px;
    left: 24px;
  }
  .lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
  }
  .lds-roller div:nth-child(7):after {
    top: 63px;
    left: 17px;
  }
  .lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
  }
  .lds-roller div:nth-child(8):after {
    top: 56px;
    left: 12px;
  }
  @keyframes lds-roller {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Info = styled.h5`
  color: #fff;
  font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
`;

export default connect<StoreProps, StoreDispatchProps, any>(
  (state) => {
    return {};
  },
  (dispatch) => {
    return {};
  }
)(Room);
