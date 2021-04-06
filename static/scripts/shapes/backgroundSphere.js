export default function BackgroundSphere() {
    const sphereGeo = new THREE.SphereGeometry(8, 20, 20);
    const sphereWire = new THREE.WireframeGeometry(sphereGeo);
    const sphereWireMesh = new THREE.LineSegments(sphereWire);
    sphereWireMesh.material.depthTest = false;
    sphereWireMesh.material.opacity = 0.035;
    sphereWireMesh.material.transparent = true;
    scene.add(sphereWireMesh);
};