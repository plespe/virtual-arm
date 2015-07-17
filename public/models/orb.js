var Orb = function(options) {
  var material, mesh, src, texture;

  // check for source of image
  if (typeof options === 'string') {
    src = options;
  } else if (options) {
    src = options.src;
  }
 
  // map image onto three.js texture
  // if (src) {
  //   texture = imageTexture(src, THREE.UVMapping);
  //   console.log(texture);
  // }

  var geometry = new THREE.SphereGeometry(10, 10, 10);

  geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  geometry.applyMatrix(new THREE.Matrix4().makeRotationY(- Math.PI / 2));

  material = new THREE.MeshBasicMaterial({
    transparent: true,
    map: THREE.ImageUtils.loadTexture( src , THREE.UVMapping)
  });

  console.log(material);

  mesh = new THREE.Mesh(geometry, material);

  // if stereo image is supported, implement stereo image
  if (options && options.stereo) {
    if (options.stereo === 'vertical') {
      texture.repeat.y = 0.5;
    } else {
      texture.repeat.x = 0.5;
    }
    mesh.userData.stereo = options.stereo;
  }

  mesh.name = 'panorama';

  mesh.position.x = 0;
  mesh.position.z = -120;

  return mesh;
}