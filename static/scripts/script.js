import * as THREE from './three/three.module.js';
import CameraControls from 'https://cdn.skypack.dev/camera-controls';
import tweenjsTweenJs from 'https://cdn.skypack.dev/@tweenjs/tween.js';
import keyCirclePositions from "./three/circlePositions.js";
const TWEEN = tweenjsTweenJs;

CameraControls.install({ THREE: THREE });


(function canvasLoad(){
    const loadingScreen = document.querySelector(".m-loading");

    const _loaded = () => {
        main();
        textComponent();
        loadingScreen.style.visibility = "hidden";
    };

    const _loading = () => {
        loadingScreen.style.visibility = "visible";
    
    };

    const manager = new THREE.LoadingManager(
        _loaded()
    );
    manager.onStart = () => {
        _loading();
    }
    return manager;
})();


function main() {
    const canvas = document.querySelector("#m-canvas__one");
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(20, 20, 36)");
    const camera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerWidth, 0.1, 1000);
    const worldOrigin = new THREE.Vector3(0, 0, 0);
    camera.position.z = 7;
    camera.lookAt(worldOrigin);


    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;

    (function lights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(4, 3, -1)
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(-4, -5, 1)
        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(-8, -1, 3)
        return scene.add(
            ambientLight,
            directionalLight,
            directionalLight2,
            directionalLight3
        );
    })();


    function makePlatonicSolids() {
        const material = new THREE.MeshStandardMaterial({
            color: "#fefefe",
            roughness: 0.0,
        });
        const normalVertMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 1).normalize(), Math.atan(Math.sqrt(2)));
        return {
            tetra: () => {
                //fire
                const tetraGeo = new THREE.TetrahedronBufferGeometry();
                tetraGeo.applyMatrix(normalVertMatrix);
                const tetra = new THREE.Mesh(tetraGeo, material);
                return tetra
            },
            cube: () => {
                //earth
                const cubeGeo = new THREE.BoxBufferGeometry();
                const cube = new THREE.Mesh(cubeGeo, material);
                return cube
            },
            octa: () => {
                //air
                const octaGeo = new THREE.OctahedronBufferGeometry();
                const octa = new THREE.Mesh(octaGeo, material);
                return octa
            },
            dodeca: () => {
                //void
                const dodecaGeo = new THREE.DodecahedronBufferGeometry();
                const dodeca = new THREE.Mesh(dodecaGeo, material);
                return dodeca
            },
            icosa: () => {
                //water
                const icosaGeo = new THREE.IcosahedronGeometry();
                icosaGeo.applyMatrix(normalVertMatrix);
                const icosa = new THREE.Mesh(icosaGeo, material);
                return icosa
            }
        }
    };

    const platonicSolids = [];
    platonicSolids.push(
        makePlatonicSolids().tetra(),
        makePlatonicSolids().cube(),
        makePlatonicSolids().octa(),
        makePlatonicSolids().icosa(),
        makePlatonicSolids().dodeca()
    );
    const platonicSolidMeshGroup = new THREE.Object3D();
    platonicSolids.forEach((solid, i) => {
        solid.position.y = i * -10;
        solid.scale.set(2, 2, 2);
        solid.receiveShadow = true;
        platonicSolidMeshGroup.add(solid);
    });
    scene.add(platonicSolidMeshGroup);

    function spinSolids(timing) {
        platonicSolidMeshGroup.position.y += Math.cos(timing) * 0.008;
        platonicSolids.forEach((solid) => {
            solid.rotation.y += 0.003;
            solid.rotation.x += 0.003;
            solid.rotation.z += 0.003;
        });
    }

    function moveSolidToWorldOrigin(index) {
        let target = new THREE.Vector3();
        target.y = index * 10;
        const toCenter = new TWEEN.Tween({ y: platonicSolidMeshGroup.position.y })
            .to({ y: target.y }, 1000)
            .easing(TWEEN.Easing.Circular.Out)
            .onUpdate(
                (value) => {
                    platonicSolidMeshGroup.position.y = value.y;
                }
            )
            .onComplete(
                () => {
                    platonicSolidMeshGroup.position.y = target.y
                }
            );
        return toCenter.start()
    }

    const miscObjects = [];
    (function elementalParticles() {
        const map = new THREE.TextureLoader().load('./static/textures/circle_05.png');
        const mat = new THREE.SpriteMaterial({ map: map });
        const spriteGroup = new THREE.Object3D();
        for (let i = 0; i < 3000; i++) {
            const sprite = new THREE.Sprite(mat);
            sprite.scale.set(0.03, 0.03)
            sprite.position.x = (Math.random() - 0.5) * 15;
            sprite.position.y = (Math.random() - 0.5) * 15;
            sprite.position.z = (Math.random() - 0.5) * 15;

            spriteGroup.add(sprite)

        }
        miscObjects.push(spriteGroup);
        scene.add(spriteGroup);
    })();

    (function backgroundSphere() {
        const geo = new THREE.SphereGeometry(8, 20, 20);
        const wire = new THREE.WireframeGeometry(geo);
        const sphereMesh = new THREE.LineSegments(wire);
        sphereMesh.material.depthTest = false;
        sphereMesh.material.opacity = 0.03;
        sphereMesh.material.transparent = true;
        miscObjects.push(sphereMesh)
        scene.add(sphereMesh);
    })();

    dotNavEventHandlers();
    function dotNavEventHandlers() {
        const dotNav = document.getElementsByClassName("dot");
        const _arr = [];
        _arr.push(...dotNav);
        _arr.forEach((dot, i) => {
            dot.addEventListener("click", () => {

                TWEEN.removeAll();
                cameraTravelToKeyPoint(
                    cameraKeyPositions[i].x,
                    cameraKeyPositions[i].y,
                    cameraKeyPositions[i].z,
                );
                moveSolidToWorldOrigin(i);
                slideLink(i)

                // void changes materials
            });
        });
    };

    function slideLink(index) {
        const siteNav = document.getElementsByClassName("h-link");
        const _navArr = [];
        _navArr.push(...siteNav);
        _navArr[index].style.transform = "translateX(10em)"
        for (let i = 0; i < _navArr.length; i++) {
            if (i == index) {
                _navArr[index].style.transform = "translateX(1em)"
            } else {
                _navArr[i].style.transform = "translateX(-10em)"
            }
        }
    };

    const cameraKeyPositions = new Array();
    keyCirclePositions(0, 0, 0, 0, 7, 5, cameraKeyPositions);

    const camControls = new CameraControls(camera, canvas);
    (function camControlSettings() {
        camControls.enabled = true;
        //camControls.dampingFactor = ;
        camControls.minPolarAngle = Math.PI * 0.50;
        camControls.maxPolarAngle = Math.PI * 0.50;
        camControls.maxDistance = 7;
        camControls.minDistance = 7;

        const truckBoundPoint = new THREE.Box3(
            worldOrigin,
            worldOrigin
        );
        camControls.setBoundary(truckBoundPoint);
    })();

    function cameraTravelToKeyPoint(newX, newY, newZ) {
        let currentPosVec3 = camControls.getPosition();
        let targetPos = new THREE.Vector3(newX, newY, newZ);
        let moveCam = new TWEEN.Tween(currentPosVec3)
            .to(targetPos, 1000)
            .easing(TWEEN.Easing.Circular.Out)
            .onStart(
                () => {
                    camControls.enabled = false;
                }
            )
            .onUpdate(
                (value) => {
                    camControls.setPosition(
                        value.x,
                        value.y,
                        value.z
                    );
                }
            )
            .onComplete(
                () => {
                    camControls.enabled = true;
                    camControls.setLookAt(
                        targetPos.x,
                        targetPos.y,
                        targetPos.z,
                        worldOrigin.x,
                        worldOrigin.y,
                        worldOrigin.z
                    );
                }
            )
        return moveCam.start();
    };

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    const clock = new THREE.Clock();
    function animate(time) {
        const elapsedTime = clock.getElapsedTime();
        let delta = clock.getDelta();

        camControls.update(elapsedTime);

        if (time != delta) {
            TWEEN.update(time -= delta);
        }

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        spinSolids(elapsedTime);

        miscObjects[0].rotation.y += 0.0034;
        miscObjects[0].rotation.x += 0.0021;
        miscObjects[0].rotation.z += 0.0013;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

function textComponent(){
    const textEl = document.querySelectorAll(".m-text");
    const textElArr = [];
    textElArr.push(...textEl);
    
    const links = document.querySelectorAll(".h-link");
    display(links, textElArr);

    const button = document.querySelectorAll(".h-close__module");
    close(button, textElArr);

    function display(inputArr = [], targetArr = []){
        inputArr.forEach((input, i)=>{
            input.addEventListener("click", ()=>{
                targetArr[i].style.transform = "translateY(0)";
                for(let ind = 0; ind < targetArr.length; ind++ ){
                    if(ind !== i){
                        targetArr[ind].style.transform = "translateY(-200%)";
                    };
                };
            });     
        });
    };
    function close(handlerElArr = [], targetElArr = []){
        handlerElArr.forEach((handler, i)=>{
            handler.addEventListener("click", ()=>{
                targetElArr[i].style.transform = "translateY(-200%)"
            });
        });
    };
};

