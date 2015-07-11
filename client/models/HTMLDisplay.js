var HDisp = function(cssScene){

  // create the plane mesh
  var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
  var geometry = new THREE.PlaneGeometry();
  var planeMesh= new THREE.Mesh( geometry, material );

  // create the dom Element
  var element = document.createElement('iframe')
  element.src = 'http://www.hackreactor.com'
  element.style.width = '1024px';
  element.style.height = '1024px';

  // create the object3d for this element
  var cssObject = new THREE.CSS3DObject( element );
  // we reference the same position and rotation 
  cssObject.position = planeMesh.position;
  cssObject.rotation = planeMesh.rotation;
  // add it to the css scene

  window.cssObject  = cssObject;
  cssObject.scale.multiplyScalar(1/15);

  cssScene.add(cssObject);

  
  // add it to the WebGL scene
  return planeMesh;

};