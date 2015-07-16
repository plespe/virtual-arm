var User = function(username, position) {
  this.username = username;
  this.model = createPlayerModel(username);
  this.model.position.x = position.x;
  this.model.position.y = position.y;
  this.model.position.z = position.z;
  scene.add(this.model);
};

var createPlayerModel = function(username) {
  // var theText = username;
  // var nameCenter = String(username).length * 2.5;

  // var hash = document.location.hash.substr( 1 );

  // if ( hash.length !== 0 ) {
  //   theText = hash;
  // }

  // var text3d = new THREE.TextGeometry( theText, {
  //   size: 7,            // font size
  //   height: 1,          // thickness of the name
  //   curveSegments: 2,
  //   font: "helvetiker"
  // });

  // // offset the player's name above the sphere model
  // for (var i = 0; i < text3d.vertices.length; i++) {
  //   text3d.vertices[i].y += 10;
  //   text3d.vertices[i].x -= nameCenter;
  // }

  // var nameMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
  // var textMesh = new THREE.Mesh(text3d, nameMaterial);

  var geometry = new THREE.BoxGeometry( 10, 30, 5 );
  // geometry.merge(text3d);

  var material   = new THREE.MeshBasicMaterial();
  material.color.set('red');

  var box = new THREE.Mesh( geometry, material );
  return box;
};