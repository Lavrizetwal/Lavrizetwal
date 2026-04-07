import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { BehaviorTree } from './ai.js';

/**
 * GESTION DU JOUEUR (FPS CONTROLS)
 */
export class Player {
    constructor(camera, domElement) {
        this.controls = new PointerLockControls(camera, domElement);
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('click', () => this.controls.lock());
    }

    onKeyDown(e) {
        switch (e.code) {
            case 'KeyW': case 'ArrowUp': this.moveForward = true; break;
            case 'KeyA': case 'ArrowLeft': this.moveLeft = true; break;
            case 'KeyS': case 'ArrowDown': this.moveBackward = true; break;
            case 'KeyD': case 'ArrowRight': this.moveRight = true; break;
        }
    }

    onKeyUp(e) {
        switch (e.code) {
            case 'KeyW': case 'ArrowUp': this.moveForward = false; break;
            case 'KeyA': case 'ArrowLeft': this.moveLeft = false; break;
            case 'KeyS': case 'ArrowDown': this.moveBackward = false; break;
            case 'KeyD': case 'ArrowRight': this.moveRight = false; break;
        }
    }

    update(delta) {
        if (!this.controls.isLocked) return;

        const speed = 30.0 * delta;
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * speed;
        if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * speed;

        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);
    }
}

/**
 * GESTION DES PNJ (POPULATION)
 */
export class NPCManager {
    constructor(scene) {
        this.scene = scene;
        this.npcs = [];
        this.count = 40; // Nombre de personnes dans le mall
        this.init();
    }

    init() {
        // Géométrie partagée pour la performance (Instancing concept)
        const geometry = new THREE.CapsuleGeometry(0.25, 0.5, 4, 8);
        
        for (let i = 0; i < this.count; i++) {
            const material = new THREE.MeshStandardMaterial({ 
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5) 
            });
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position aléatoire initiale
            mesh.position.set(
                (Math.random() - 0.5) * 60,
                0.75,
                (Math.random() - 0.5) * 60
            );
            mesh.castShadow = true;
            
            const npcData = {
                mesh: mesh,
                ai: new BehaviorTree(this),
                target: new THREE.Vector3(),
                speed: 1.5 + Math.random() * 2,
                setTarget: (pos) => npcData.target.copy(pos),
                distToTarget: () => mesh.position.distanceTo(npcData.target),
                setRandomTarget: () => {
                    npcData.target.set((Math.random() - 0.5) * 70, 0.75, (Math.random() - 0.5) * 70);
                }
            };
            
            npcData.setRandomTarget();
            this.npcs.push(npcData);
            this.scene.add(mesh);
        }
    }

    update(delta) {
        this.npcs.forEach(npc => {
            npc.ai.update(delta);
            
            // Déplacement vers la cible
            const direction = new THREE.Vector3().subVectors(npc.target, npc.mesh.position).normalize();
            const distance = npc.mesh.position.distanceTo(npc.target);
            
            if (distance > 0.5) {
                npc.mesh.position.addScaledVector(direction, npc.speed * delta);
                npc.mesh.lookAt(npc.target.x, 0.75, npc.target.z);
            }
        });
    }
}