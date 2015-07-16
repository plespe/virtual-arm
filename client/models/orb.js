var Orb = function(options) {
  var material, mesh, src, texture;

  // check for source of image
  if (typeof options === 'string') {
    src = options;
  } else if (options) {
    src = options.src;
  }
 
  // map image onto three.js texture
  if (src) {
    texture = imageTexture(src, THREE.UVMapping);
    console.log(texture);
  }

  var geometry = new THREE.SphereGeometry(10, 10, 10);

  geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
  geometry.applyMatrix(new THREE.Matrix4().makeRotationY(- Math.PI / 2));

  material = new THREE.MeshBasicMaterial({
    transparent: true,
    map: texture
  });

  mesh = new THREE.Mesh(geometry, material);

  // if stereo image is supported, implement stereo image
  if (options && options.stereo) {
    if (options.stereo === 'vertical') {
      texture.repeat.y = 0.5;
    } else {
      texture.repeat.x = 0.5;
    }
    mesh.userData.stereo = options.stereo;
  }

  mesh.name = 'panorama';

  mesh.position.x = 0;
  mesh.position.z = -120;

  return mesh;
}

var imageTexture = function (src, mapping, callback ) {
  var image,
    imgParse,
    texture,
    isDataUri;

  var imageLoaded = function() {
    var scale,
      canvas,
      ctx,
      smallImage;

    /*
    iOS doesn't know how to handle large images. Even though the MAX_TEXTURE_SIZE
    may be 4096, it still breaks on images that large. So we scale them down.
    */
    scale = Math.max( image.naturalWidth, image.naturalHeight );

    canvas = document.createElement('canvas');
    canvas.width = Math.floor(image.naturalWidth);
    canvas.height = Math.floor(image.naturalHeight);

    ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, canvas.width, canvas.height);

    image = canvas;

    texture = new THREE.Texture(undefined, mapping);

    texture.image = image;
    texture.needsUpdate = true;
    if (typeof callback === 'function') {
      setTimeout(callback.bind(null, texture, image), 1);
    }
  };

  // We need to decide if each image will be accessed by URL, or by another system.
  // https://gist.github.com/dperini/729294
  urlRegex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  dataUri = /^data:image\/(?:png|jpe?g|gif);/
  // dataUri = /^(.*\.(?!(png|jpe?g|gif)$))?[^.]*$/i
  imgParse = dataUri.exec(src);
  isDataUri = !!imgParse;
  if (!imgParse) {
    imgParse = urlRegex.exec(src);
  }
  
  if (!imgParse) {
   console.error('Invalid image URL: ' + src);
   return;
  }


  // do we want to store images on the client? If so, use code below, with "images" key/value store.
  // if (images[src]) {
  //   image = images[src];
  // } else {
  image = document.createElement('img');
  if (imgParse && (imgParse[1] && imgParse[1] !== window.location.hostname || imgParse[2] && imgParse[2] !== window.location.port)) {
    image.crossOrigin = 'anonymous';
  }
  image.src = src;
  // images[src] = image;
  // }

  // texture = new THREE.Texture(undefined, mapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.NearestFilter);

  if (image.naturalWidth || isDataUri) {
    setTimeout(imageLoaded, 1);
  } else {
    image.addEventListener('load', imageLoaded);
  }

  return texture;
};