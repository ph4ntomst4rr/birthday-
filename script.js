const colors = {
    carnationPink: 0xF7B3C2,  
    orchidPurple:  0x9F4C7D,  
    tallPoppyRed:  0xD22B2B,  
    whiteCream:    0xF5F5F5   
};

const container = document.getElementById('cake-3d-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 4, 7); 
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const cakeGroup = new THREE.Group();

function createMatteMaterial(colorValue) {
    return new THREE.MeshStandardMaterial({ color: colorValue, roughness: 0.6, metalness: 0.1 });
}

// Cake Layers
const bottomGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const bottomMesh = new THREE.Mesh(bottomGeom, createMatteMaterial(colors.orchidPurple));
bottomMesh.position.y = 0.25;
cakeGroup.add(bottomMesh);

const midRingGeom = new THREE.CylinderGeometry(1.23, 1.23, 0.1, 32);
const midRingMesh = new THREE.Mesh(midRingGeom, createMatteMaterial(colors.tallPoppyRed));
midRingMesh.position.y = 0.55;
cakeGroup.add(midRingMesh);

const topGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const topMesh = new THREE.Mesh(topGeom, createMatteMaterial(colors.carnationPink));
topMesh.position.y = 0.85;
cakeGroup.add(topMesh);

const topRingGeom = new THREE.CylinderGeometry(1.23, 1.23, 0.1, 32);
const topRingMesh = new THREE.Mesh(topRingGeom, createMatteMaterial(colors.tallPoppyRed));
topRingMesh.position.y = 1.15;
cakeGroup.add(topRingMesh);

const dollopCount = 8;
const cakeRadius = 0.9;
for (let i = 0; i < dollopCount; i++) {
    const angle = (i / dollopCount) * Math.PI * 2;
    const dollopGeom = new THREE.ConeGeometry(0.12, 0.18, 16);
    const dollopMesh = new THREE.Mesh(dollopGeom, createMatteMaterial(colors.whiteCream));
    dollopMesh.position.x = Math.cos(angle) * cakeRadius;
    dollopMesh.position.z = Math.sin(angle) * cakeRadius;
    dollopMesh.position.y = 1.25;
    cakeGroup.add(dollopMesh);
}

scene.add(cakeGroup);
const textureLoader = new THREE.TextureLoader();
const frameGroup = new THREE.Group(); 
const photoFiles = ['1st.PNG', '2nd.PNG', '3rd.jpg'];
const frameCount = photoFiles.length;
const orbitRadius = 3.5; 
// --- FIXED & WALL-MOUNTED PHOTOS SETUP ---
photoFiles.forEach((fileName, index) => {
    const singleFrameContainer = new THREE.Group();
    
    // Position them horizontally in a row along the back wall (Z = -3.8)
    // Spacing them out: index 0 is left, index 1 is center, index 2 is right
    singleFrameContainer.position.x = (index - 1) * 3.8; 
    singleFrameContainer.position.y = 1.8;   // Height on the wall
    singleFrameContainer.position.z = -3.8;  // Flushed against the back wall
    
    // Keep them facing straight forward toward the camera
    singleFrameContainer.rotation.set(0, 0, 0);

    // --- EVEN BIGGER SIZE: Stretched to look like real poster frames ---
    const borderGeom = new THREE.BoxGeometry(3.4, 2.6, 0.05);
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const borderMesh = new THREE.Mesh(borderGeom, borderMat);
    singleFrameContainer.add(borderMesh);

    textureLoader.load(fileName, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        
        const photoGeom = new THREE.PlaneGeometry(3.2, 2.4);
        const photoMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const photoMesh = new THREE.Mesh(photoGeom, photoMat);
        photoMesh.position.z = 0.03; 
        singleFrameContainer.add(photoMesh);
    });
    scene.add(singleFrameContainer); 
});
scene.add(frameGroup);
window.addEventListener('resize', () => {
    if (container.clientWidth && container.clientHeight) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
});

let clock = new THREE.Clock();
// ==========================================
//      ADDING THE ROOM (TABLE & WALL)
// ==========================================

// 1. THE BACKGROUND ACCENT WALL
const wallGeometry = new THREE.PlaneGeometry(25, 15);
// Creating a cozy teal/blue textured wallpaper look using a built-in canvas pattern
const wallCanvas = document.createElement('canvas');
wallCanvas.width = 128;
wallCanvas.height = 128;
const wallCtx = wallCanvas.getContext('2d');
wallCtx.fillStyle = '#2b4a4f'; // Base wallpaper color
wallCtx.fillRect(0, 0, 128, 128);
wallCtx.strokeStyle = '#375e64'; // Elegant diamond/stripes pattern lines
wallCtx.lineWidth = 2;
wallCtx.beginPath();
wallCtx.moveTo(0, 0); wallCtx.lineTo(128, 128);
wallCtx.moveTo(128, 0); wallCtx.lineTo(0, 128);
wallCtx.stroke();

const wallTexture = new THREE.CanvasTexture(wallCanvas);
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(8, 4); // Repeats the pattern across the wall cleanly

const wallMaterial = new THREE.MeshStandardMaterial({ 
    map: wallTexture, 
    roughness: 0.9 
});
const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh.position.set(0, 2.5, -4.0); 
scene.add(wallMesh);
const tableGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 32);

const tableMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x5c4033, 
    roughness: 0.4,   
    metalness: 0.1 
});
const tableMesh = new THREE.Mesh(tableGeometry, tableMaterial);
tableMesh.position.set(0, -0.1, 0); 
scene.add(tableMesh);

const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
const legMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });
const legMesh = new THREE.Mesh(legGeometry, legMaterial);
legMesh.position.set(0, -2.1, 0); 
scene.add(legMesh);
function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
   
    cakeGroup.rotation.y += 0.005;
    if (typeof frameGroup !== 'undefined') {
        frameGroup.rotation.y -= 0.003;
        frameGroup.children.forEach((frame, i) => {
            frame.position.y = 0.8 + Math.sin(elapsedTime * 1.5 + i) * 0.08;
        });
    }
    
    renderer.render(scene, camera);
}

animate();
function nextMemory() {
    console.log("Button pressed!");
}
