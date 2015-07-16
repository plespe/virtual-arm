var conn = new WebSocket("ws://127.0.0.1:8080/connect");

var clientSocket = {
  connect: function(){
    conn = new WebSocket("ws://{{$}}/connect");
  },

  /*-----------------

    Send Messages

  ------------------*/
  // Player body movement
  playerMove: function(data){
    // data = {x,y,z}
    data = 'ubp:'+JSON.stringify(data);
    conn.send(data);
  },
  // Player head movemement
  playerMoveHead: function(data){


  },
  /*-----------------

    Receive Messages

  ------------------*/
  // New player joins
  otherJoin: function(data){
    // Create a new model

    // Save it into container
    playerContainer[data.name] = {position:{},rotation:{}};
  },
  // Other player body movement
  otherMove: function(data){

    // Change position with broadcasted position
    // playerContainer[data.name]

  },
  // Other player head movement
  otherHeadMove: function(data){

  },
  // On receiving messages
  onMessage: function(data){

  }
}

/*----------------
  Event Listening
-----------------*/
conn.onmessage = function(evt) {
  var eventName = evt.data.split(":")[0];
  var data = JSON.parse(evt.data.substring(eventName.length+1));
// On new player join
  if(eventName === 'cp'){
    clientSocket.otherJoin(data);
  }
// On another player's body movement
  if(eventName === 'ubp'){
    clientSocket.otherMove(data);
  }
// On another player's head movement
  if(eventName === 'uhp'){
    clientSocket.otherHeadMove(data);
  }
// On player sending a message
  if(eventName === 'sm'){
    clientSocket.otherHeadMove(data);
  }
// On new player join

};
