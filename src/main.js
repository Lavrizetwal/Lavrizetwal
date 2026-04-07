import { Engine } from './core.js';
import { MallWorld } from './environment.js';
import { Player, NPCManager } from './entities.js';

const engine = new Engine();
const world = new MallWorld(engine.scene);
const player = new Player(engine.camera, engine.renderer.domElement);
const npcs = new NPCManager(engine.scene);

function loop() {
    requestAnimationFrame(loop);
    const delta = 0.016; // 60 FPS aprox
    
    player.update();
    npcs.update(delta);
    engine.renderer.render(engine.scene, engine.camera);
}

loop();