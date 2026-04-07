import * as THREE from 'three';

export class MallWorld {
    constructor(scene) {
        this.scene = scene;
        this.createFloor();
        this.createWalls();
        this.createShops();
        this.createCeiling();
        this.addDecorations();
    }

    createFloor() {
        // Sol poli avec reflets (StandardMaterial avec haute métalité)
        const floorGeo = new THREE.PlaneGeometry(200, 200);
        const floorMat = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            metalness: 0.9, 
            roughness: 0.1 
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Grille de guidage subtile (style luxe)
        const grid = new THREE.GridHelper(200, 40, 0xffd700, 0x222222);
        grid.position.y = 0.01;
        this.scene.add(grid);
    }

    createWalls() {
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        
        // Mur du fond
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(200, 15, 1), wallMat);
        backWall.position.set(0, 7.5, -50);
        this.scene.add(backWall);

        // Murs latéraux
        const sideWallGeo = new THREE.BoxGeometry(1, 15, 100);
        const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
        leftWall.position.set(-50, 7.5, 0);
        const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
        rightWall.position.set(50, 7.5, 0);
        this.scene.add(leftWall, rightWall);
    }

    createShops() {
        // --- BOUTIQUE : LAVRI ZETWAL ---
        this.buildShop(-30, "LAVRI ZETWAL", 0x00aaff); // Bleu propre

        // --- BOUTIQUE : TECH HUB ---
        this.buildShop(0, "TECH HUB (AI)", 0xffd700); // Or

        // --- BOUTIQUE : SHOP ZETWAL ---
        this.buildShop(30, "SHOP ZETWAL", 0xffffff); // Blanc luxe
    }

    buildShop(xPos, name, color) {
        const group = new THREE.Group();

        // Structure de la boutique (Vitrines)
        const frameGeo = new THREE.BoxGeometry(20, 10, 5);
        const frameMat = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            transparent: true, 
            opacity: 0.7 
        });
        const shopFrame = new THREE.Mesh(frameGeo, frameMat);
        group.add(shopFrame);

        // Enseigne Néon Lumineuse
        const signGeo = new THREE.BoxGeometry(15, 2, 0.5);
        const signMat = new THREE.MeshStandardMaterial({ 
            color: color, 
            emissive: color, 
            emissiveIntensity: 2 
        });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, 6, 2.6);
        group.add(sign);

        // Lumière ponctuelle pour l'effet de halo
        const pointLight = new THREE.PointLight(color, 10, 15);
        pointLight.position.set(0, 5, 5);
        group.add(pointLight);

        group.position.set(xPos, 5, -45);
        this.scene.add(group);
    }

    createCeiling() {
        const ceilingGeo = new THREE.PlaneGeometry(200, 200);
        const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 15;
        this.scene.add(ceiling);
    }

    addDecorations() {
        // Bancs au milieu du Mall
        const benchGeo = new THREE.BoxGeometry(6, 0.5, 2);
        const benchMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
        
        for(let i = -2; i <= 2; i++) {
            const bench = new THREE.Mesh(benchGeo, benchMat);
            bench.position.set(i * 15, 0.25, -10);
            this.scene.add(bench);
        }
    }
}