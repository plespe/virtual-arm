THREE.FPControls = function(controls,controlObj,camera,objects){

  // Collision
  var raycaster;
  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  // Animation
  var prevTime = performance.now();
  var velocity = new THREE.Vector3();

  // Movement bools
  this.controlsEnabled = true;
  // var controlsEnabled = this.controlsEnabled;
  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;
  var rotateLeft = false;
  var rotateRight = false;

  this.events = function(){
    var onKeyDown = function ( event ) {

      switch ( event.keyCode ) {

        case 69: // e
          rotateRight = true;
          break;

        case 81: // q
          rotateLeft = true;
          break;

        case 38: // up
        case 87: // w
          moveForward = true;
          break;

        case 37: // left
        case 65: // a
          moveLeft = true; break;

        case 40: // down
        case 83: // s
          moveBackward = true;
          break;

        case 39: // right
        case 68: // d
          moveRight = true;
          break;

        case 32: // space
          if ( canJump === true ) velocity.y += 150;
          canJump = false;
          break;

        case 86: // v
          toggleVR();
          break;

      }

    };

    var onKeyUp = function ( event ) {

      switch( event.keyCode ) {

        case 69: // e
          rotateRight = false;
          break;

        case 81: // q
          rotateLeft = false;
          break;

        case 38: // up
        case 87: // w
          moveForward = false;
          break;

        case 37: // left
        case 65: // a
          moveLeft = false;
          break;

        case 40: // down
        case 83: // s
          moveBackward = false;
          break;

        case 39: // right
        case 68: // d
          moveRight = false;
          break;
      }

    };

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
  }

  this.VRMovement = function(){
      if ( this.controlsEnabled ) {
      raycaster.ray.origin.copy( camera.position );
      raycaster.ray.origin.y -= 10;

      var intersections = raycaster.intersectObjects( objects );

      var isOnObject = intersections.length > 0;

      var time = performance.now();
      var delta = ( time - prevTime ) / 1000;

      velocity.x -= velocity.x * 4.0 * delta;
      velocity.z -= velocity.z * 4.0 * delta;

      // velocity.y -= 9.8 * 35.0 * delta; // 35.0 = mass

      var speed = 400.0;

      if ( moveForward ) velocity.z -= speed * delta;
      if ( moveBackward ) velocity.z += speed * delta;
      if ( moveLeft ) velocity.x -= speed * delta;
      if ( moveRight ) velocity.x += speed * delta;

      // Manual rotation
      if ( rotateLeft ) {
        controlObj.rotation.y += delta;
      }
      if ( rotateRight ) {
        controlObj.rotation.y -= delta;
      }


      if(moveForward || moveBackward || moveLeft || moveRight){ // IF MOVING
        console.log("Sending massive messages....");
        clientSocket.playerMove({
          x:controlObj.position.x,
          y:controlObj.position.y,
          z:controlObj.position.z,
          r:0
        });
      }

      if ( isOnObject === true ) {
        velocity.y = Math.max( 0, velocity.y );
        canJump = true;
      }

      controlObj.translateX( velocity.x * delta );
      controlObj.translateY( velocity.y * delta );
      controlObj.translateZ( velocity.z * delta );

      if ( controlObj.position.y < 10  || controlObj.position.y > 10) {
        velocity.y = 0;
        controlObj.position.y = 10;
        canJump = true;
      }

      prevTime = time;

    }
  };

  this.KeyboardMovement = function(){
    if ( this.controlsEnabled ) {
      raycaster.ray.origin.copy( controls.getObject().position );
      raycaster.ray.origin.y -= 10;

      var intersections = raycaster.intersectObjects( objects );

      var isOnObject = intersections.length > 0;

      var time = performance.now();
      var delta = ( time - prevTime ) / 1000;

      velocity.x -= velocity.x * 4.0 * delta;
      velocity.z -= velocity.z * 4.0 * delta;

      velocity.y -= 9.8 * 35.0 * delta; // 35.0 = mass

      var speed = 400.0;

      if ( moveForward ) velocity.z -= speed * delta;
      if ( moveBackward ) velocity.z += speed * delta;
      if ( moveLeft ) velocity.x -= speed * delta;
      if ( moveRight ) velocity.x += speed * delta;

      if(moveForward || moveBackward || moveLeft || moveRight){ // IF MOVING

      }


      if ( isOnObject === true ) {
        velocity.y = Math.max( 0, velocity.y );
        canJump = true;
      }

      controls.getObject().translateX( velocity.x * delta );
      controls.getObject().translateY( velocity.y * delta );
      controls.getObject().translateZ( velocity.z * delta );

      if ( controls.getObject().position.y < 10 ) {

        velocity.y = 0;
        controls.getObject().position.y = 10;

        canJump = true;
      }

      prevTime = time;

    }
  };

  this.overLay = function(){
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    blocker.style.display = 'none';
    instructions.style.display = 'none';

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {

      var element = document.body;

      var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

          this.controlsEnabled = true;
          controls.enabled = true;

          blocker.style.display = 'none';

        } else {

          controls.enabled = false;

          blocker.style.display = '-webkit-box';
          blocker.style.display = '-moz-box';
          blocker.style.display = 'box';

          instructions.style.display = '';

        }

      }

      var pointerlockerror = function ( event ) {

        instructions.style.display = '';

      }

      // Hook pointer lock state change events
      document.addEventListener( 'pointerlockchange', pointerlockchange, false );
      document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
      document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

      document.addEventListener( 'pointerlockerror', pointerlockerror, false );
      document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
      document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

      instructions.addEventListener( 'click', function ( event ) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if ( /Firefox/i.test( navigator.userAgent ) ) {

          var fullscreenchange = function ( event ) {
            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

              document.removeEventListener( 'fullscreenchange', fullscreenchange );
              document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
              
              element.requestPointerLock();
            }
          }

          document.addEventListener( 'fullscreenchange', fullscreenchange, false );
          document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

          element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

          element.requestFullscreen();

        } else {

          element.requestPointerLock();

        }

      }, false );

    } else {

      instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }
  };

  this.events(); // Add events to DOM

};
    