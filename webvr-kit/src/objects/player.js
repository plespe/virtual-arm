module.exports = (function () {
	'use strict';

	var materials = require('../materials'),
		THREE = require('three');

	  var createPlayerModel = function(username) {
	    var theText = username;
	    var nameCenter = String(username).length * 2.5;

	    var hash = document.location.hash.substr( 1 );

	    if ( hash.length !== 0 ) {
	      theText = hash;
	    }

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

	    var geometry = new THREE.SphereGeometry( 1, 30, 30 );
	    // geometry.merge(text3d);

	    var sphere = new THREE.Mesh( geometry, materials.standard() );
	    return sphere;
	  };

	return function player(parent, options) {
		var player = createPlayerModel('bryan');

		parent.add(player);

		return player;
	};
}());