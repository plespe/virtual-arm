package main

import (
    "github.com/gorilla/websocket"
    "net/http"
    "fmt"    
    "strings"
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

func parseMessage(message string) {
  splitMessage := strings.SplitN(message, ":", 2)
  eventName := splitMessage[0]
  messageContents := splitMessage[1]
  handleEvent(eventName, messageContents)
}

func (player *Player) reader() {
    for {
        _, message, err := player.ws.ReadMessage()
        if err != nil {
            break
        }
        fmt.Println(string(message))
        //time.Sleep(5000 * time.Millisecond)
        parseMessage(string(message))
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

func (player *Player) updateBodyPosition() {

}

func (player *Player) updateHeadPosition() {

}

var upgrader = &websocket.Upgrader{ReadBufferSize: 1024, WriteBufferSize: 1024}

type PlayerHandler struct {
    room *GameRoom
}

func (playerHandler PlayerHandler) createPlayer(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        return
    }
    player := &Player{send: make(chan []byte, 256), ws: ws, room: playerHandler.room, name: "CHANGE!!!!", id: "THIS!!!!"}
    player.room.register <- player

    fmt.Println("Created player " + player.id + " in room " + player.room.id)

    defer func() { player.room.unregister <- player }()
    go player.writer()
    player.reader()
}


