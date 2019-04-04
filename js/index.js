// grabs associated fragment shader
const fragmentFor = num => {
    return document.querySelector(`.fragment-${num}`).textContent;
};

const createWorlds = scene => {
    const clock = new THREE.Clock();
    const group = new THREE.Group();

    const uniforms = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() } };


    const varyVertices = geometry => {
        geometry.mergeVertices();
        geometry.morphTargets.push({
            name: 'flex',
            vertices: geometry.vertices.map(vertex => {
                const scalar = Math.random() * 0.4 + 0.8;
                return vertex.clone().multiplyScalar(scalar);
            }) });

    };

    const animate = () => {
        const delta = clock.getDelta();
        uniforms.time.value += delta * 5;
        group.children.map(world => {
            world.morphTargetInfluences = [Math.sin(Date.now() * 0.001)];
            world.rotation.x += delta * 0.5;
            world.rotation.y += delta * 0.5;
        });
    };

    // the vertex shader is the same for all 4 planets
    const vertexShader = document.querySelector('.vertex').textContent;
    [0, 1, 2, 3].map(num => {
        let world = new THREE.Mesh(
            new THREE.SphereGeometry(200, 20, 20),
            new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader: fragmentFor(num),
                morphTargets: true,
                vertexColors: THREE.FaceColors }));


        world.position.set(...[
            [-300, 300, 0],
            [300, 300, 0],
            [-300, -300, 0],
            [300, -300, 0]][
                num]);
        varyVertices(world.geometry);
        group.add(world);
    });

    scene.add(group);

    return { animate };
};

const animate = () => {
    worlds.animate();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
};

// base three.js setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x272727);

const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 1, 10000);
camera.position.z = 1000;
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

scene.add(new THREE.AmbientLight(0xFFFFFF, 1));

const worlds = createWorlds(scene);

document.body.appendChild(renderer.domElement);
animate();
