import React, { Component } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

import { connect } from 'core';
import { PageProps, StoreDispatchProps, StoreProps, AuthPageState } from './types';
import { Scene, PerspectiveCamera, WebGLRenderer, Object3D, Mesh } from 'three';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { MtlObjBridge } from 'three/examples/jsm/loaders/obj2/bridge/MtlObjBridge';

const SCALE = 1;

const STEP_SIZE = 0.2;

const ROOM_WIDTH = 3.5;
const ROOM_HEIGHT = 5.25;
const ROOM_TAIL = 2.3;

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
  mousePressed: boolean = false;
  scale: number = 1;
  angleX: number = 0;
  angleY: number = 0;
  room: Object3D;

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

    //this.addHelpers();
    this.room = new THREE.Object3D();
    //this.room.scale.set(SCALE, SCALE, SCALE);

    this.scene.add(this.room);

    this.addWalls();

    this.addLight();

    this.addSofa();

    this.renderScene();
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
    this.room.add(ambientLight);
  }

  addWalls() {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('https://static.ihaveblog.ru/texture.jpg');
    const oboitex = loader.load('https://static.ihaveblog.ru/oboi.jpg');

    const oboitex2 = loader.load('https://static.ihaveblog.ru/oboi.jpg');

    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);

    oboitex.wrapS = THREE.RepeatWrapping;
    oboitex.wrapT = THREE.RepeatWrapping;
    oboitex.repeat.set(10, 7);

    oboitex2.wrapS = THREE.RepeatWrapping;
    oboitex2.wrapT = THREE.RepeatWrapping;
    oboitex2.repeat.set(15, 7);

    const polGeometry = new THREE.PlaneBufferGeometry(ROOM_WIDTH, ROOM_HEIGHT, 100, 200);
    const polMaterial = new THREE.MeshPhongMaterial({ map: tex });

    const pol = new THREE.Mesh(polGeometry, polMaterial);
    pol.position.set(ROOM_WIDTH / 2, 0, ROOM_HEIGHT / 2);
    pol.rotateX(-Math.PI / 2);

    const walls = [
      new THREE.Mesh(
        new THREE.PlaneBufferGeometry(ROOM_WIDTH, ROOM_TAIL, 100, 200),
        new THREE.MeshPhongMaterial({ map: oboitex })
      ),
      new THREE.Mesh(
        new THREE.PlaneBufferGeometry(ROOM_HEIGHT, ROOM_TAIL, 100, 200),
        new THREE.MeshPhongMaterial({ map: oboitex2 })
      ),
      new THREE.Mesh(
        new THREE.PlaneBufferGeometry(ROOM_HEIGHT, ROOM_TAIL, 100, 200),
        new THREE.MeshPhongMaterial({ map: oboitex2 })
      ),
      new THREE.Mesh(
        new THREE.PlaneBufferGeometry(ROOM_WIDTH, ROOM_TAIL, 100, 200),
        new THREE.MeshPhongMaterial({ map: oboitex })
      ),
    ];

    walls[0].position.set(ROOM_WIDTH / 2, ROOM_TAIL / 2, 0);

    walls[1].rotateY(-Math.PI / 2);
    walls[1].position.set(ROOM_WIDTH, ROOM_TAIL / 2, ROOM_HEIGHT / 2);

    walls[2].rotateY(Math.PI / 2);
    walls[2].position.set(0, ROOM_TAIL / 2, ROOM_HEIGHT / 2);

    walls[3].position.set(ROOM_WIDTH / 2, ROOM_TAIL / 2, ROOM_HEIGHT);
    walls[3].rotateY(Math.PI);

    const potolokGeometry = new THREE.PlaneBufferGeometry(ROOM_WIDTH, ROOM_HEIGHT, 100, 200);
    const potolokMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0, roughness: 1 });

    const potolok = new THREE.Mesh(potolokGeometry, potolokMaterial);
    potolok.position.set(ROOM_WIDTH / 2, ROOM_TAIL, ROOM_HEIGHT / 2);
    potolok.rotateX(Math.PI / 2);

    this.room.add(pol);

    walls.forEach((wall) => {
      this.room.add(wall);
    });

    this.room.add(potolok);
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

    if (newX > STEP_SIZE && newX < ROOM_WIDTH - STEP_SIZE) {
      this.cameraPosition.x = newX;
    }

    if (newZ > STEP_SIZE && newZ < ROOM_HEIGHT - STEP_SIZE) {
      this.cameraPosition.z = newZ;
    }

    this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
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

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.renderScene);
  }

  addSofa() {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader2();

    mtlLoader.load('/static/models/sofa.mtl', (mtlParseResult) => {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);

      objLoader.addMaterials(materials, false);

      objLoader.load('/static/models/sofa.obj', (root: Mesh) => {
        root.position.set(ROOM_WIDTH / 2 + 1.1, 0, ROOM_HEIGHT / 2 - 1.3);
        root.scale.set(0.0010, 0.0012, 0.0010);
        root.rotateY(-Math.PI / 2);

        this.room.add(root);
      });
    });
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
