import * as THREE from 'three';

export class Engine {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x020205, 0.02);
        
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        
        this.initLights();
    }

    initLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        const sun = new THREE.DirectionalLight(0xffd700, 1.2);
        sun.position.set(10, 20, 10);
        sun.castShadow = true;
        this.scene.add(ambient, sun);
    }
}