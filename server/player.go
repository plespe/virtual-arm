package main

import (
    "github.com/gorilla/websocket"
    "net/http"
    "fmt"    
    "strings"
    "log"
    //"time"
)

type BodyPosition struct {
    x float32
    y float32
    z float32
    r float32
}

type HeadPosition struct {
    x float32
    y float32
    z float32 
    w float32      
}

type Player struct {
    id string
    name string

    bodyPosition *BodyPosition
    headPosition *HeadPosition

    // The websocket connection.
    ws *websocket.Conn

    // Buffered channel of outbound messages.
    send chan []byte

    // The hub.
    room *GameRoom
}

func parseMessage(message string, player *Player) {
  splitMessage := strings.SplitN(message, ":", 2)
  eventName := splitMessage[0]
  messageContents := splitMessage[1]
  handleEvent(eventName, messageContents, player)
}

func (player *Player) reader() {
    for {
        _, message, err := player.ws.ReadMessage()
        if err != nil {
            break
        }
        fmt.Println(string(message))
        //time.Sleep(5000 * time.Millisecond)
        parseMessage(string(message), player)
    }
    player.ws.Close()
}

func (player *Player) writer() {
    for message := range player.send {
        err := player.ws.WriteMessage(websocket.TextMessage, message)
        if err != nil {
            break
        }
    }
    player.ws.Close()
}

func (player *Player) updateBodyPosition(x float32, y float32, z float32, r float32) {
  player.bodyPosition.x = x
  player.bodyPosition.y = y
  player.bodyPosition.z = z
  player.bodyPosition.r = r
}

func (player *Player) updateHeadPosition(x float32, y float32, z float32, w float32) {
  player.headPosition.x = x
  player.headPosition.y = y 
  player.headPosition.z = z  
  player.headPosition.w = w  
}

var upgrader = &websocket.Upgrader{ReadBufferSize: 1024, WriteBufferSize: 1024}

type PlayerHandler struct {
    room *GameRoom
}

func (playerHandler PlayerHandler) createPlayer(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
      log.Fatal(err)
    }
    player := &Player{send: make(chan []byte, 256), bodyPosition: &BodyPosition{x: 0.0, y: 0.0, z: 0.0, r: 0.0}, headPosition: &HeadPosition{x: 0.0, y: 0.0, z: 0.0, w: 0.0}, 
      ws: ws, room: playerHandler.room, name: "CHANGE!!!!", id: "THIS!!!!"}
    player.room.register <- player

    fmt.Println("Created player " + player.id + " in room " + player.room.id)

    defer func() { player.room.unregister <- player }()
    go player.writer()
    player.reader()
}


