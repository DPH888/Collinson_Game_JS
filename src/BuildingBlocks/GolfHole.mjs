import * as THREE from "three";
import * as CANNON from "cannon-es";
import { engine } from "../engine.mjs";
class GolfHole { 
    //dupka
    constructor(x, y, z, radiusTop, RadiusBottom,Height,RadialSegments,HightSegments,x2,y2,z2, radiusTop2, RadiusBottom2 ,Height2) {
const holeGeometry = new THREE.CylinderGeometry(radiusTop, RadiusBottom, Height, RadialSegments, HightSegments);
const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const hole = new THREE.Mesh(holeGeometry, holeMaterial);
hole.position.set(x,y,z);
engine.scene.add(hole); 

const groundMaterialPhysics = new CANNON.Material(); 
groundMaterialPhysics.restitution = 0; 
var cylinderShape = new CANNON.Cylinder(radiusTop, RadiusBottom, Height, RadialSegments);
var cylinderBody = new CANNON.Body({ mass: 0, material: groundMaterialPhysics });
cylinderBody.addShape(cylinderShape);
cylinderBody.position.set(x, y, z);
console.log(cylinderBody.position, hole.position);
cylinderBody.type = CANNON.Body.STATIC;
engine.cannonjs_world.addBody(cylinderBody);
    //detection point
var geometry = new THREE.CylinderGeometry(radiusTop2, RadiusBottom2 ,Height2);
var material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
var ellipse = new THREE.Mesh(geometry, material);
ellipse.position.set(x2,y2,z2);
engine.scene.add(ellipse);

const groundMaterialPhysics2 = new CANNON.Material(); 
groundMaterialPhysics2.restitution = 1; 
var cylinderShape = new CANNON.Cylinder(radiusTop2, RadiusBottom2, Height2, 32); 
var cylinderBody = new CANNON.Body({ mass: 0, material: groundMaterialPhysics2 });
cylinderBody.addShape(cylinderShape);
cylinderBody.position.set(x, y, z);
console.log(cylinderBody.position, ellipse.position);
cylinderBody.type = CANNON.Body.STATIC;
engine.cannonjs_world.addBody(cylinderBody);
}}
export { GolfHole };