module.exports = (function () {
	'use strict';

	var materials = require('../materials'),
		THREE = require('three'),
		geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// geometry = new THREE.CubeGeometry( 15, 15, 15 );


	return function box(parent, options) {
		var mesh;

		// var mirrorMaterial = new THREE.MeshBasicMaterial( { color: 0x111111, envMap: mirrorCamera.renderTarget } );

		// mesh = new THREE.Mesh(geometry, mirrorMaterial);
		mesh = new THREE.Mesh(geometry, materials.standard());
		mesh.name = 'box';


		parent.add(mesh);

		return mesh;
	};
}());