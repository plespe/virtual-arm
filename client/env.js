var env = function(){ // Container function, invoked immediately.

  // Basic Objects
  var camera, scene, cssScene, renderer, cssRenderer, effect, cssEffect;
  var geometry, material, mesh;
  var controls; // VR camera controls
  var controlObj; // camera holder / head object
  // var testCount = 0;
  var FPControls;

  // Collision
  var objects = [];

  init();
  animate();

  // Set up basic scene
  function init() {

    // CSS3D Renderer
    cssRenderer = new THREE.CSS3DStereoRenderer();
    // cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize( window.innerWidth, window.innerHeight );
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = 0;
    cssRenderer.domElement.style.margin = 0;
    cssRenderer.domElement.style.padding  = 0;
    cssRenderer.domElement.setAttribute("class","doms"); // Set main CSSRenderer class to doms

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({alpha:true});
    renderer.domElement.style.position  = 'absolute';
    renderer.domElement.style.top = 0;
    renderer.domElement.style.zIndex  = 0;
    renderer.setClearColor( 0xffffff ); // Set Sky Color
    $(cssRenderer.domElement).prepend(renderer.domElement);
    // cssRenderer.domElement.appendChild(renderer.domElement);

    document.body.appendChild(cssRenderer.domElement); // Add it to the DOM
    // document.body.appendChild( renderer.domElement );

    // Scene
    scene = new THREE.Scene();
    cssScene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

    // Camera, effect = VR dual cameras
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    effect = new THREE.VREffect( renderer );
    effect.setSize( window.innerWidth, window.innerHeight );
    // cssEffect = new THREE.VREffect( cssRenderer );

    /* 
      Mouse Controls
      controls = new THREE.PointerLockControls( camera );
      scene.add(controls.getObject());
    */

    // Head
    controlObj = new THREE.Object3D();
    controlObj.add( camera ); // add camera to the head
    scene.add(controlObj);

    // Attach VR Controls to camera
    controls = new THREE.VRControls (camera);

   // Lighting
    var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    light.position.set( 0.5, 1, 0.75 );
    scene.add( light );

    window.addEventListener( 'resize', onWindowResize, false );

    // FP Controls
    FPControls = new THREE.FPControls(controls,controlObj,camera,objects);
    FPControls.overLay();

    // Adding basic models
    var floor = new Floor();
    // var box = new Box();
    var testOrb = new Orb("http://i.imgur.com/SCoTmZu.jpg")
    var divDisp = DDisp(); // div display element, sits there.
    // var frameDisp = new HDisp(cssScene); // iFrame stuff

    var user2 = new User('user2','149823',{x:40,y:10,z:10}); // sample user


    FDisp(); // Create the interactable input box.

    // Disable movement when the textbox is clicked
    $('.doms').on('focus','input',function(e){
      FPControls.controlsEnabled = false;
    });
    $('.doms').on('blur','input',function(e){
      FPControls.controlsEnabled = true;
    });

    scene.add( floor );
    // scene.add( box );
    scene.add( testOrb );
    scene.add( user2.model );
    cssScene.add( divDisp );

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );

  }

  function animate() {
    console.log(controlObj.position.x);
    // ubp:{"x": 1.0, "y": 2.0, "z": 3.0, "r": 4.0}
    // socket.send(JSON.stringify({
    //   ubp:{"x": controlObj.position.x,"y": controlObj.position.y,"z": controlObj.position.z,"r": controlObj.rotation.r}
    // }));

    requestAnimationFrame( animate );
    FPControls.VRMovement();
    controls.update();
    effect.render(scene,camera);
    // cssEffect.render( cssScene, camera);
    cssRenderer.render( cssScene, camera);
    
    // FPControls.KeyboardMovement();
    // renderer.render(scene, camera);
  };


}();
