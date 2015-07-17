var HDisp = function(){

  // create the plane mesh
  var material = new THREE.MeshBasicMaterial({ wireframe: true });
  var geometry = new THREE.PlaneGeometry();
  var planeMesh= new THREE.Mesh( geometry, material );

  planeMesh.position.x = 100;
  planeMesh.position.y = 10;
  planeMesh.position.z = -60;

  // create the dom Element
  var element = document.createElement('iframe');
  element.setAttribute("class","test");
  element.src = 'http://www.hackreactor.com';
  element.style.width = '1024px';
  element.style.height = '1024px';

  // DIV Element
  // var element = document.createElement("input");
  // element.setAttribute("class","test");
  // element.setAttribute("placeholder","type some text...");

  // create the object3d for this element
  var cssObject = new THREE.CSS3DObject( element );
  // we reference the same position and rotation 
  cssObject.position.x = planeMesh.position.x;
  cssObject.position.z = planeMesh.position.z;
  cssObject.position.y = planeMesh.position.y+10;
  cssObject.rotation = planeMesh.rotation;
  // add it to the css scene

  cssObject.scale.multiplyScalar(1/15);

  // add it to the WebGL scene
  return cssObject;

};