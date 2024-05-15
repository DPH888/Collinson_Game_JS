import * as THREE from "three";
import * as CANNON from "cannon-es";
import { engine } from "../engine.mjs";
import { materials } from "../asset_loading/assets_3d.mjs";

class Cylinder {
    constructor(x, y, z, radius, length) {
        // Block visual representation
        var geometry = new THREE.CylinderGeometry(radius, radius, length, 32);
        var cylinder = new THREE.Mesh(geometry, materials.Concrete2); // Corrected variable name
        cylinder.position.set(x, y, z);
        engine.scene.add(cylinder); // Corrected variable name

        // Block physics and collision detection
        const groundMaterialPhysics = new CANNON.Material(); // Create a new material
        groundMaterialPhysics.restitution = 1; // Set the restitution coefficient to 0.5 (adjust as needed)
        var cylinderShape = new CANNON.Cylinder(radius, radius, length, 32); // Corrected shape definition
        var cylinderBody = new CANNON.Body({ mass: 0, material: groundMaterialPhysics });
        // var quat = new CANNON.Quaternion();
        // quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        // var translation = new CANNON.Vec3(0, 0, 0);
        // cylinderShape.transformAllPoints(translation, quat);
        cylinderBody.addShape(cylinderShape);
        cylinderBody.position.set(x, y, z);
        console.log(cylinderBody.position, cylinder.position);
        cylinderBody.type = CANNON.Body.STATIC;
        engine.cannonjs_world.addBody(cylinderBody);
    }
}
export { Cylinder };