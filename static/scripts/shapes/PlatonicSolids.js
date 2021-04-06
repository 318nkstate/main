import * as THREE from '../three/three.module.js';
export default class PlatonicSolids {
    constructor(){
        this.normalVertMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 1).normalize(), Math.atan(Math.sqrt(2)));
        }
    
    tetra(material) {
        //fire
        const tetraGeo = new THREE.TetrahedronBufferGeometry();
        tetraGeo.applyMatrix(this.normalVertMatrix);
        const tetra = new THREE.Mesh(tetraGeo, material);
        return tetra
    };
    cube(material) {
        //earth
        const cubeGeo = new THREE.BoxBufferGeometry();
        cubeGeo.applyMatrix(this.normalVertMatrix);
        const cube = new THREE.Mesh(cubeGeo, material);
        return cube
    };
    octa(material) {
        //air
        const octaGeo = new THREE.OctahedronBufferGeometry();
        octaGeo.applyMatrix(this.normalVertMatrix);
        const octa = new THREE.Mesh(octaGeo, material);
        return octa
    };
    icosa(material){
        //water
        const icosaGeo = new THREE.IcosahedronGeometry();
        icosaGeo.applyMatrix(this.normalVertMatrix);
        const icosa = new THREE.Mesh(icosaGeo, material);
        return icosa
    };
    dodeca(material){
        //void
        const dodecaGeo = new THREE.DodecahedronBufferGeometry();
        dodecaGeo.applyMatrix(this.normalVertMatrix);
        const dodeca = new THREE.Mesh(dodecaGeo, material);
        return dodeca
    };
};