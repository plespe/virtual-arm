var env = function(){ // Container function, invoked immediately.

  // Basic Objects
  var camera, scene, cssScene, renderer, cssRenderer, effect, cssEffect;
  var geometry, material, mesh;
  var controls; // VR camera controls
  var controlObj; // camera holder / head object

  var FPControls;

  // Collision
  var objects = [];

  init();
  animate();

  // Set up basic scene
  function init() {

    // WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor( 0xffffff ); // Set Sky Color

    // CSS3D Renderer
    cssRenderer = new THREE.CSS3DStereoRenderer();
    // cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize( window.innerWidth, window.innerHeight );
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = 0;

    // Scene
    scene = new THREE.Scene();
    cssScene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

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
    var box = new Box();
    var disp = new HDisp(cssScene);
    disp.position.x = -40;
    disp.position.z = -40;

    scene.add( floor );
    scene.add( box );
    scene.add( disp );

    document.body.appendChild(cssRenderer.domElement);
  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );

  }

  function animate() {

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
