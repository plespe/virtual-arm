module.exports = (function () {
	'use strict';

	var materials = require('../materials'),
		THREE = require('three'),
		geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// geometry = new THREE.CubeGeometry( 15, 15, 15 );


        // var THREE = VR.THREE;

        var verticalMirror = new THREE.Mirror( THREE.renderer, THREE.camera, { clipBias: 0.003, textureWidth: 100, textureHeight: 100, color:0x889999 } );


	return function objmirror(parent, options) {
        var verticalMirrorMesh = new VR.THREE.Mesh( new VR.THREE.PlaneBufferGeometry( 60, 60 ), verticalMirror.material );

		verticalMirrorMesh.name = 'objmirror';
        verticalMirrorMesh.add( verticalMirror );
        verticalMirrorMesh.position.y = 35;
        verticalMirrorMesh.position.z = -45;

		parent.add(verticalMirrorMesh);

		return verticalMirrorMesh;
	};
}());