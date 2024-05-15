import * as THREE from "three";
import { engine } from "../engine.mjs";
import * as CANNON from "cannon-es";
import { materials } from "../asset_loading/assets_3d.mjs";
import * as perlin from 'perlin.js';

function createHillsBufferGeometry(sizeX, sizeY, N, noiseScale, scaleZ) {

    // TODO: refactor and make readable
    const uvTex = new THREE.TextureLoader().load("./images/LiminalTextureLib/Grass2.jpg");
    console.log(uvTex)
    const material01 = new THREE.MeshPhongMaterial({ map: uvTex, side: THREE.DoubleSide, });	//   uv grid
    const geometry = new THREE.BufferGeometry();
    console.log(sizeX, sizeY)
    // const vertices = new Float32Array([
    //     -1.0, -1.0, 1.0, // v0
    //     1.0, -1.0, 1.0, // v1
    //     1.0, 1.0, 1.0, // v2
    //     -1.0, 1.0, 1.0, // v3
    //     // .....
    // ]);
    let scale = noiseScale;
    // Generate perlin noise heightmap
    let vertices = Array.from({length: N}, (_, x) => Array.from({length: N}, (_, y)=> 
            perlin.perlin2(x/scale, y/scale)
        ))  
    // Reduce 2d array of numbers(heights) to 1d array of vertices
    .reduce((heightList, curRow, i) => {
        return Array.prototype.concat(
            heightList,
            // Map each height to an array with 3 elements
            curRow
                .map((height, j)=>[i, height, j])
                .reduce((vertices, curVertex)=>{
                    // console.log(vertices, curVertex);
                    return vertices.concat(curVertex)}, []));
    }, []);

    let indices1 = Array.from({length: N-1}, (_, x) => Array.from({length: N-1}, (_, y)=> 
        [x + y*N, x+y*N+ 1, x + (y+1)*N]
    )).reduce((list, curTriangle)=>Array.prototype.concat(list, curTriangle), [])
    .reduce((list, curTriangle)=>Array.prototype.concat(list, curTriangle), []);

    let indices2 = Array.from({length: N-1}, (_, x) => Array.from({length: N-1}, (_, y)=> 
        [x + (y+1)*N+ 1, x + (y+1)*N, x+y*N+ 1]
    )).reduce((list, curTriangle)=>Array.prototype.concat(list, curTriangle), [])
    .reduce((list, curTriangle)=>Array.prototype.concat(list, curTriangle), []);
    console.log(vertices);
    // console.log(ind2);

    // const indices = [
    // // V0 V1 V2
    //     0, 1, 2,
    // // V2 V3 V0
    //     2, 3, 0,
    // ];
    let indices = Array.prototype.concat(indices1, indices2);
    console.log(indices);
    let repOn = 2;
    let uvMap = Array.from({ length: N }, (_, x) => Array.from({ length: N }, (_, y) => 
        [(x%repOn)/repOn, (y%repOn)/repOn]
    )).reduce((list, curTriangle)=>Array.prototype.concat(list, curTriangle), [])
    .reduce((list, curTriangle)=>Array.prototype.concat(list, curTriangle), []);
    console.log(vertices);

    console.log(uvMap);
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvMap), 2));
    geometry.computeVertexNormals();

    // const material = new THREE.MeshPhongMaterial({ color: "green" });
    const mesh = new THREE.Mesh(geometry, material01);

    console.log(mesh);
    mesh.position.set(-sizeX*N/2, -20, -sizeY*N/2);
    mesh.scale.set(sizeX, scaleZ, sizeY);
    engine.scene.add(mesh);
}

export {createHillsBufferGeometry};