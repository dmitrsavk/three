import React, { Component } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

import { connect } from 'core';
import { PageProps, StoreDispatchProps, StoreProps, AuthPageState } from './types';
import { Scene, PerspectiveCamera, WebGLRenderer, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const STEP_SIZE = 10;

const ROOM_WIDTH = 3.5;
const ROOM_HEIGHT = 5.25;
const ROOM_TAIL = 2.3;

const MODEL_URL = 'https://static.ihaveblog.ru/model/scene.gltf';

class Room extends Component<PageProps, AuthPageState> {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  canvas: HTMLCanvasElement;
  objects: Object3D[] = [];
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  } = {
    x: ROOM_WIDTH / 2,
    y: 1.5,
    z: ROOM_HEIGHT - STEP_SIZE,
  };
  scale: number = 1;
  angleX: number = 0;
  angleY: number = 0;
  room: Object3D;
  mousePressed: boolean = false;

  state = {
    loading: true,
  };

  constructor(props: PageProps) {
    super(props);

    this.renderScene = this.renderScene.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);

    this.init3D();

    //@ts-ignore
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    //@ts-ignore
    this.canvas.addEventListener('mouseup', this.onMouseUp);
    //@ts-ignore
    this.canvas.addEventListener('mousemove', this.onMouseMove);

    this.loadModel();
  }

  onMouseDown = (event: React.MouseEvent) => {
    this.mousePressed = true;
  };

  onMouseUp = (event: React.MouseEvent) => {
    this.mousePressed = false;
  };

  onMouseMove = (event: React.MouseEvent) => {
    if (this.mousePressed) {
      this.angleY += event.movementX / this.canvas.clientWidth;
      this.angleX += event.movementY / this.canvas.clientHeight;
  
      this.camera.rotation.x = this.angleX / this.scale;
      this.camera.rotation.y = this.angleY / this.scale;
    }
  };

  init3D() {
    this.canvas = document.getElementById('room-page-canvas') as HTMLCanvasElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);

    this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    this.camera.lookAt(ROOM_WIDTH / 2, ROOM_TAIL / 3, 0)

    this.camera.rotation.order = 'YXZ';

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
  }

  addHelpers() {
    const grid = new THREE.GridHelper(100, 100);
    const axes = new THREE.AxesHelper(6);

    axes.renderOrder = 1;
    //@ts-ignore
    axes.material.depthTest = false;

    grid.renderOrder = 1;

    this.scene.add(grid);
    this.scene.add(axes);
  }

  addLight() {
    const directionLight = new THREE.DirectionalLight(0xffffff, 0.1);
    this.scene.add(directionLight);

    const adirectionLight = new THREE.DirectionalLight(0xffffff, 0.4);
    adirectionLight.position.set(ROOM_WIDTH / 2, 0, ROOM_HEIGHT / 2);
    adirectionLight.target.position.set(ROOM_WIDTH / 2, ROOM_TAIL, ROOM_HEIGHT / 2);
    this.room.add(adirectionLight);
    this.room.add(adirectionLight.target);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(ROOM_WIDTH / 2, ROOM_TAIL - 0.5, ROOM_HEIGHT / 2);
    pointLight.distance = 8;
    this.room.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);
  }

  onKeyPress = (event: any) => {
    const dx = STEP_SIZE * Math.cos(this.angleY);
    const dz = STEP_SIZE * Math.sin(this.angleY);

    let newX = this.cameraPosition.x;
    let newZ = this.cameraPosition.z;

    switch (event.keyCode) {
      case 68:
        newX = this.cameraPosition.x + dx;
        newZ = this.cameraPosition.z - dz;
        break;
      case 65:
        newX = this.cameraPosition.x - dx;
        newZ = this.cameraPosition.z + dz;
        break;
      case 87:
        newX = this.cameraPosition.x - dz;
        newZ = this.cameraPosition.z - dx;
        break;
      case 83:
        newX = this.cameraPosition.x + dz;
        newZ = this.cameraPosition.z + dx;
        break;
    }

    this.cameraPosition.x = newX;
    this.cameraPosition.z = newZ;

    this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
  };

  needResize() {
    const pixelRatio = window.devicePixelRatio;
    //const pixelRatio = 1;
    const width = this.canvas.clientWidth * pixelRatio;
    const height = this.canvas.clientHeight * pixelRatio;

    const needResize = this.canvas.width !== width || this.canvas.height !== height;

    this.renderer.setSize(width, height, false);

    return needResize;
  }

  loadModel() {
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(MODEL_URL, (gltf) => {
      const root = gltf.scene;

      this.filterObj(gltf.scene);

      this.scene.add(root);

      this.setState({ loading: false });

      this.renderScene();
    });
  }

  logObj(scene: THREE.Object3D) {
    console.log(scene.name);

    if (scene.children && scene.children.length) {
      scene.children.forEach((child) => {
        this.logObj(child);
      });
    }
  }

  filterObj(scene: THREE.Object3D) {
    //couch_0
    //couch_00_Material_#9477_0

    if (scene.children && scene.children.length) {
      scene.children.forEach((child, index) => {
        if (child.name === 'couch_0' || child.name === 'couch_00_Material_#9477_0') {
          scene.children[index] = new THREE.Object3D();
        } else {
          this.filterObj(child);
        }
      });
    }
  }

  renderScene() {
    if (this.needResize()) {
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.renderScene);
  }

  render() {
    const { loading } = this.state;

    return (
      <Page>
        <Canvas id="room-page-canvas" />
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
