var DDisp = function(){

  var obj = {};
  // create the plane mesh
  var material = new THREE.MeshBasicMaterial( { wireframe:true } );
  // material.color = 'black';
  material.color.set('black');
  material.opacity   = 0;
  material.blending  = THREE.NoBlending;

  var geometry = new THREE.PlaneGeometry();
  var planeMesh = new THREE.Mesh( geometry, material );

  planeMesh.position.x = 20;
  planeMesh.position.y = 10;
  planeMesh.position.z = -60;

  obj.planeMesh = planeMesh;

  // DIV Element
  var element = document.createElement("div");
  element.setAttribute("class","textDisplay");

  // create the object3d for this element
  var cssObject = new THREE.CSS3DObject( element );
  // we reference the same position and rotation 
  cssObject.position.x = planeMesh.position.x;
  cssObject.position.z = planeMesh.position.z;
  cssObject.position.y = planeMesh.position.y+10;
  cssObject.rotation = planeMesh.rotation;

  cssObject.scale.multiplyScalar(1/15);
  
  obj.cssObject = cssObject;

  return obj;

};