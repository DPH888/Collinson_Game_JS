    import { engine } from "./engine.mjs";
    import * as THREE from "three";
    import * as CANNON from "cannon-es";
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import Stats from 'three/examples/jsm/libs/stats.module.js';
    import { Ramp } from "./BuildingBlocks/Ramp.mjs";
    import { BuildingBlock } from "./BuildingBlocks/BuildingBlock.mjs";
    import { MovingPlatform } from "./BuildingBlocks/MovingPlatform.mjs";
    import { Cylinder } from "./BuildingBlocks/Cylinder.mjs";
    import { GolfHole } from "./BuildingBlocks/GolfHole.mjs";
    // Visuals for the game
    import { Skybox, skybox_texture } from "./asset_loading/assets_3d.mjs";
    import { firingTheBall } from "./firingTheBall.mjs";
    import { initSoundEvents, playRandomSoundEffectFall } from "./Sounds.mjs";
    import { createPineTree } from "./BuildingBlock_no_collision/pine.mjs";
    import { createBall, ballMesh, ballBody, moveBall } from "./ball.mjs";
    import { createNewEmitter, updateEmitters } from "./BuildingBlocks/Particle.mjs";
    import { Menu, initMenu, menuConfig } from "./menu.mjs";
    import { areColliding } from './utils.mjs';
    import { createHillsBufferGeometry } from './Terrain/Hills.mjs';

    const orbitControls = true;
    let controls = null;

    function createGround() {
        // Create ground plane
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 2, shape: groundShape });
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Set rotation to align with Cannon.js
        groundBody.position.set(0, 0, 0); // Set position
        engine.cannonjs_world.addBody(groundBody);

        // Create visual representation of ground (in Three.js)
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2; // Rotate to align with Cannon.js
        engine.scene.add(groundMesh);
    }
        engine.onmouseup = ((e) => {
            let mouseX = e.clientX;
            let mouseY = e.clientY;
    if (areColliding(mouseX, mouseY, 1, 1, 275, 200, 250, 100)) { //Play
        moveBall();

    }
})
    function initCamera() {
        // Init camera
        engine.camera.position.set(0, 20, 80);
        engine.camera.lookAt(0, 10, 0);

        // Change far frustum plane to account for skybox
        engine.camera.far = 10000;
        engine.camera.updateProjectionMatrix();
    }

    function initLights() {
        // Ambient light is now the skybox
        const ambientLight = new THREE.AmbientLight(skybox_texture, 1);
        engine.scene.add(ambientLight);

        // Directional light is white to not tint the Phong material too much
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        directionalLight.lookAt(0, 0, 0);
        engine.scene.add(directionalLight);
    }

    function initLevel() {
        // createGround();
        const block1 = new BuildingBlock(0, 5, 0, 20, 10, 20);
        // const block2 = new BuildingBlock(20, 0, 0, 50, 10, 20);

        // new BuildingBlock(0, 5, 0, 20, 10, 20);
        new Ramp(16.5, 2.5, 0, 20, Math.PI, Math.PI / 4);
        new Ramp(33, -5.2, 0, 20, 0, 0);

        new BuildingBlock(30, -10, 0, 40, 10, 20);

        new MovingPlatform(15, 20, 20, 30, 30, 30, 20, 1, 15);
        new Cylinder(25, 0, 2, 5, 5);
        new GolfHole(51.2, -6, 0, 1.8, 1, 2.1, 64, 12, 51.2, -5.9, 0, 1, 2, 2);
        createPineTree(0, 20, 0);
    }

    let ballDirectionMesh = [];
    function initBallDirectionArrows() {
        let colors = [0xffd000, 0xff9900, 0xff0000];
        for (let i = 0; i < 3; i++) {
            const ballDirectionGeometry = new THREE.ConeGeometry(0.5, 5, 5);
            const ballDirectionMaterial = new THREE.MeshPhongMaterial({ color: colors[i], flatShading: true });
            ballDirectionMesh.push(new THREE.Mesh(ballDirectionGeometry, ballDirectionMaterial));
            ballDirectionMesh[i].position.set(5, 30 + 4 * i, 0);

            engine.scene.add(ballDirectionMesh[i]);
        }
    }

    let time = 0;
    function initGame() {
        // initSoundEvents();
        if (menuConfig.showMenu) {
            initMenu(initLevel);
        } else {
            menuConfig.gameStarted = true;
            initSoundEvents();
            initLevel();
        }
        // Create ball and attach to window
        createBall(11, 30, 0);

        createHillsBufferGeometry(10, 10, 100, 5, 20);
        // Init slider and buttons for firing the ball
        firingTheBall.initUI();

        // Setup camera position
        initCamera();

        // Init orbit controls
        if (orbitControls) {
            controls = new OrbitControls(engine.camera, engine.canvas2d);
            controls.target = ballMesh.position;
            controls.maxDistance = 150
            controls.enableDamping = true
            controls.dampingFactor = .1
            if (menuConfig.gameStarted == false) {
                controls.autoRotate = true
                controls.autoRotateSpeed = 0.5
            }
        }
        initLights();

        initBallDirectionArrows();

        // Init skybox
        const skybox = new Skybox();

        // DEBUG spawn test emitter

        let lastDX, lastDY, lastDZ;

        // Set custom update function
        engine.update = () => {
            time++;
            if (controls) controls.update();

            // Update all particle systems
            updateEmitters();

            // Update ball mesh position
            ballMesh.position.copy(ballBody.position);

            const bounceThreshold = 3;

            function checkBounce(lastVelocities, currentVelocities) {
                return Object.keys(currentVelocities).some(axis =>
                    Math.abs(lastVelocities[axis] - currentVelocities[axis]) > bounceThreshold
                );
            }

            const currentVelocities = { x: ballBody.velocity.x, y: ballBody.velocity.y, z: ballBody.velocity.z };

            if (checkBounce({ x: lastDX, y: lastDY, z: lastDZ }, currentVelocities)) {
                createNewEmitter(ballBody.position.x, ballBody.position.y, ballBody.position.z, "burst", { particle_cnt: 50, particle_lifetime: { min: 0.2, max: 0.5 }, power: 0.05, fired: false });
                playRandomSoundEffectFall();
            }
            lastDX = currentVelocities.x;
            lastDY = currentVelocities.y;
            lastDZ = currentVelocities.z;
            make_the_ball_static_when_is_not_moving();

            adjust_the_ball_direction();

            show_the_ball_direction();

            if (ballBody.position.y < -50) { // Respawns the ball if it has fallen beneath the map
                ballBody.position.set(firingTheBall.shotFromWhere.x, firingTheBall.shotFromWhere.y, firingTheBall.shotFromWhere.z);
                ballBody.type = CANNON.Body.STATIC;
                firingTheBall.isBallShot = false;
            }
        };
    }
    function make_the_ball_static_when_is_not_moving() {
        const velocityThreshold = 0;
        const timeInterval = 10;
    
        if (time % timeInterval === 0 && ballBody.velocity.length() < velocityThreshold) {
            const groundRay = new CANNON.Ray(
                new CANNON.Vec3(ballBody.position.x, ballBody.position.y - 1.1, ballBody.position.z),
                new CANNON.Vec3(ballBody.position.x, ballBody.position.y - 1.2, ballBody.position.z)
            );
    
            const intersect = groundRay.intersectWorld(engine.cannonjs_world, {});
    
            if (intersect) {
                ballBody.type = CANNON.Body.STATIC;
                firingTheBall.isBallShot = false;
            }

        }
    }

    function adjust_the_ball_direction() {
        firingTheBall.direction = Math.atan2(ballMesh.position.z - engine.camera.position.z, ballMesh.position.x - engine.camera.position.x);
    }

    function show_the_ball_direction() {
        for (let i = 0; i < 3; i++) {
            if (firingTheBall.isBallShot) {
                ballDirectionMesh[i].visible = false;
                continue;
            }
            if (ballDirectionMesh[i] !== undefined) {
                // Calculates the needed arrows
                if (i <= Math.floor(Math.abs((firingTheBall.power + 20) / 100) * 2)) {
                    ballDirectionMesh[i].visible = true;

                    ballDirectionMesh[i].position.set(
                        ballMesh.position.x + Math.cos(firingTheBall.direction) * 3.5 * (i + 1),
                        ballMesh.position.y,
                        ballMesh.position.z + Math.sin(firingTheBall.direction) * 3.5 * (i + 1)
                    );

                    ballDirectionMesh[i].rotation.x = Math.PI / 2;
                    ballDirectionMesh[i].rotation.y = 0;
                    ballDirectionMesh[i].rotation.z = firingTheBall.direction - Math.PI / 2;

                } else {
                    ballDirectionMesh[i].visible = false;
                }
            }
        }
    }

    let game = {
        init: initGame
    };

    export { game };
