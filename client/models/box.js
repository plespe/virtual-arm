var Box = function(){
  var geo = new THREE.BoxGeometry(20,20,20);
  var material = new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading, wireframe: true });
  var mesh = new THREE.Mesh(geo,material);
  mesh.position.x = -10;
  mesh.position.z = -40;

  return mesh;
};