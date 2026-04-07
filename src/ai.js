import * as THREE from 'three';

export class BehaviorTree {
    constructor(npc) {
        this.npc = npc;
        this.states = ['WANDER', 'SHOPPING', 'RESTING'];
        this.currentState = 'WANDER';
        this.timer = 0;
    }

    update(delta) {
        this.timer += delta;
        
        switch(this.currentState) {
            case 'WANDER':
                if (this.timer > 5) { // Après 5s de marche, va acheter quelque chose
                    this.currentState = 'SHOPPING';
                    this.npc.setTarget(new THREE.Vector3(20, 0, -10)); 
                    this.timer = 0;
                }
                break;
            case 'SHOPPING':
                if (this.npc.distToTarget() < 1) {
                    this.currentState = 'RESTING';
                    this.timer = 0;
                }
                break;
            case 'RESTING':
                if (this.timer > 3) {
                    this.currentState = 'WANDER';
                    this.npc.setRandomTarget();
                    this.timer = 0;
                }
                break;
        }
    }
}