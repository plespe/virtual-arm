var Floor = function(){

  // floor
  var geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
  geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

  // Add bumpiness to floor
  for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
    var vertex = geometry.vertices[ i ];
    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;
  }

  for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
    var face = geometry.faces[ i ];
    face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
  }

  var material = new THREE.MeshBasicMaterial( {color: 0x228c14} );

  floorMesh = new THREE.Mesh( geometry, material );
  floorMesh.position.y = -40;

  return floorMesh;

};