import React, { Component } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';

import { connect } from 'core';
import { PageProps, StoreDispatchProps, StoreProps, AuthPageState } from './types';
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, Mesh, Vector3, Object3D } from 'three';

class Sun extends Component<PageProps, AuthPageState> {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  cube: Mesh;
  canvas: HTMLCanvasElement;
  lathe: Mesh;
  objects: Object3D[] = [];
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  } = {
    x: 0,
    y: 2,
    z: 5,
  };
  time: number = Date.now();

  constructor(props: PageProps) {
    super(props);

    this.renderScene = this.renderScene.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyPress);

    this.init3D();

    //this.addHelpers();

    this.addLight();
    this.addSun();

    this.renderScene();
  }

  init3D() {
    this.canvas = document.getElementById('room-page-canvas') as HTMLCanvasElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);

    this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
  }

  addHelpers() {
    const axes = new THREE.GridHelper(100, 100);

    //@ts-ignore
    axes.renderOrder = 1;

    this.scene.add(axes);
  }

  addLight() {
    const directionLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionLight.position.set(1, -1, 1);
    this.scene.add(directionLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 0);
    this.scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
  }

  addSun() {
    const sunCS = new THREE.Object3D();
    this.scene.add(sunCS);

    const sunGeometry = new THREE.SphereBufferGeometry(1, 100, 100);
    const sunMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    sun.position.set(0, 0, 0);

    sunCS.add(sun);

    const earthCS = new THREE.Object3D();
    earthCS.position.set(-2, 0, 0);
    sunCS.add(earthCS);

    const earthGeometry = new THREE.SphereBufferGeometry(0.2, 100, 100);
    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x3c00e0, shininess: 0 });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);

    earthCS.add(earth);

    const moonCs = new THREE.Object3D();
    moonCs.position.set(-0.5, 0, 0);

    const moonGeometry = new THREE.SphereBufferGeometry(0.05, 100, 100);
    const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x7f7f7f });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    earthCS.add(moonCs);
    moonCs.add(moon);

    this.objects.push(moon);
    this.objects.push(moonCs);
    this.objects.push(sun);
    this.objects.push(sunCS);
    this.objects.push(earthCS);
    this.objects.push(earth);
  }

  onKeyPress = (event: any) => {
    if (event.keyCode == 39) {
      this.cameraPosition.x += 0.2;
      this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    } else if (event.keyCode == 37) {
      this.cameraPosition.x -= 0.2;
      this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    } else if (event.keyCode == 38) {
      this.cameraPosition.z -= 0.2;
      this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
    } else if (event.keyCode == 40) {
      this.cameraPosition.z += 0.2;
      this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
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

    const newTime = Date.now();
    const angle = (Math.PI / 4) * ((newTime - this.time) / 1000);

    this.objects.forEach((mesh) => {
      mesh.rotation.y = angle;
    });

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.renderScene);
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
)(Sun);
