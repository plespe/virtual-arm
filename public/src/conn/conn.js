var clientSocket = {
  connect: function(){
    conn = new WebSocket("ws://127.0.0.1:8080/connect");
    setTimeout(function(){conn.send('cp:'); conn.send('np:');},2000);
    /*----------------
      Event Listening
    -----------------*/
    conn.onmessage = function(evt) {
      console.log(evt);
      var eventName = evt.data.split(":")[0];
      var data = JSON.parse(evt.data.substring(eventName.length+1));

    // On your first join
      if(eventName === 'cp'){
        clientSocket.playerJoin(data);
      }
    // On new player join
      if(eventName === 'np'){
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
  // When you join
  playerJoin: function(data){
    // Receive event with all users
    console.log(data);
    for (var i = 0; i < data.players.length; i++) {
      console.log('fetching all users...');
      var user = data.players[i];
      playerContainer[user.username] = new User(user.username,user.bodyPosition);
    };
  },
  // New player joins
  otherJoin: function(data){
    console.log('fetching new user info...');
    console.log(data);
    // Create a new model
    // var user = new User(data.name,{x:data.x,y:data.y,z:data.z});
    var user = new User(data.username,{x:0,y:0,z:0});
    // Save it into container
    playerContainer[data.username] = user;
  },
  // Other player body movement
  otherMove: function(data){
    console.log('otherperson moving',data.bodyPosition.x,data.bodyPosition.z);
    console.log(playerContainer[data.username]);
    // Change position with broadcasted position

    playerContainer[data.username].model.position.x = data.bodyPosition.x
    playerContainer[data.username].model.position.y = data.bodyPosition.y
    playerContainer[data.username].model.position.z = data.bodyPosition.z
    // playerContainer[data.name]

  },
  // Other player head movement
  otherHeadMove: function(data){

  },
  // On receiving messages
  onMessage: function(data){

  }
}


