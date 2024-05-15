import * as THREE from "three";
import { engine } from "../engine.mjs";
import { materials } from "../asset_loading/assets_3d.mjs";

function createPineTree(x, y, z) {
    let treeHeight = 20, nSegments = 5, baseHeight = treeHeight/4, biggestSegmentRadius = 8;
    let treeGroup = new THREE.Group();
    let trunkGeom = new THREE.CylinderGeometry(
        1, 1, treeHeight, 10 );
    let trunkMesh = new THREE.Mesh(trunkGeom, materials.Wood);
    trunkMesh.position.set(0, treeHeight/2 ,0);
    console.log(materials.Wood)
    treeGroup.add(trunkMesh);
    treeGroup.position.set(x, y, z);


    for(let i = 0; i <= nSegments; i++) {
        let treeSegmentGeom = new THREE.ConeGeometry( 1 +  biggestSegmentRadius/(2+i), 2 + (treeHeight - baseHeight)/nSegments, 32 );
        let treeMesh = new THREE.Mesh(treeSegmentGeom, materials.Grass);
        treeMesh.position.set(0, baseHeight + i*(treeHeight-baseHeight)/nSegments, 0);
        treeGroup.add(treeMesh);
    }
    engine.scene.add(treeGroup);
    return treeGroup;
}
export {createPineTree};
