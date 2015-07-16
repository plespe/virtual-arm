/*
 * This is the player superclass and is used as a basis for every player and including the user
 * Position, player, team ID, flag status, and radius are defined server side and passed to players upon joining the game.
 * Team Id is either 0 or 1
 * Username is defined by user on loading the page
 * Position is an Object with x and y values eg: {x: 50, y:230}
 * canvasContext refers to global canvas node
 */

var Player
THREE.Player = Player = function(username, id, position, canvasContext, teamId, flag, radius) {
  this.username = username;
  this.id = id;
  this.position = {x: position.x, y: position.y};
  // this.team = teamId;
  // this.hasFlag = flag; // boolean value for having flag or not
  // this.score = false; // only becomes true when a player scores a point. Avoids multiple win events at once
};

