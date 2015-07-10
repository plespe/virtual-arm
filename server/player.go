package main

import (
    "github.com/gorilla/websocket"
    "net/http"
    "fmt"    
)


type Player struct {
    id string
    name string

    // The websocket connection.
    ws *websocket.Conn

    // Buffered channel of outbound messages.
    send chan []byte

    // The hub.
    room *GameRoom
}

func parseMessage(message string) {
  
}

func (player *Player) reader() {
    for {
        _, message, err := player.ws.ReadMessage()
        if err != nil {
            break
        }
        fmt.Println(message)
        player.room.broadcast <- message
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


