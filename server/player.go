package main

import (
    "github.com/gorilla/websocket"
    "net/http"
    "fmt"    
    "strings"
    "log"
    "strconv"
    //"encoding/json"
    //"time"
)

type BodyPosition struct {
    X float32 `json:"x"`
    Y float32 `json:"y"`
    Z float32 `json:"z"`
    R float32 `json:"r"`
}

type HeadPosition struct {
    X float32 `json:"x"`
    Y float32 `json:"y"`
    Z float32 `json:"z"`
    W float32 `json:"w"`     
}

type Player struct {
    Id int `json:"id"`
    Username string `json:"username"`

    BodyPosition *BodyPosition `json:"bodyPosition"`
    HeadPosition *HeadPosition `json:"headPosition"`

    // The websocket connection.
    Ws *websocket.Conn `json:"ws"`

    // Buffered channel of outbound messages.
    Send chan []byte `json:"send"`

    // The hub.
    Room *GameRoom `json:"room"`
}

func parseMessage(message string, player *Player) {
  splitMessage := strings.SplitN(message, ":", 2)
  eventName := splitMessage[0]
  messageContents := splitMessage[1]
  handleEvent(eventName, messageContents, player)
}

func (player *Player) reader() {
    for {
        _, message, err := player.Ws.ReadMessage()
        if err != nil {
            break
        }
        //fmt.Println(string(message))
        //time.Sleep(5000 * time.Millisecond)
        parseMessage(string(message), player)
    }
    player.Ws.Close()
}

func (player *Player) writer() {
    for message := range player.Send {
        err := player.Ws.WriteMessage(websocket.TextMessage, message)
        if err != nil {
            break
        }
    }
    player.Ws.Close()
}

func (player *Player) updateBodyPosition(x float32, y float32, z float32, r float32) {
  player.BodyPosition.X = x
  player.BodyPosition.Y = y
  player.BodyPosition.Z = z
  player.BodyPosition.R = r
}

func (player *Player) updateHeadPosition(x float32, y float32, z float32, w float32) {
  player.HeadPosition.X = x
  player.HeadPosition.Y = y 
  player.HeadPosition.Z = z  
  player.HeadPosition.W = w  
}

var upgrader = &websocket.Upgrader{ReadBufferSize: 1024, WriteBufferSize: 1024}

type PlayerHandler struct {
    Id int `json:"id"`
    Username string `json:"username"`
    Room *GameRoom `json:"room"`
}


type PlayerPositionListOutbound struct {
    Players []*PlayerPositionOutbound `json:"players"`
}

type PlayerPositionOutbound struct {
    Id int `json:"id"`
    Username string `json:"username"`

    BodyPosition *BodyPosition `json:"bodyPosition"`
    HeadPosition *HeadPosition `json:"headPosition"`
}

type PlayerBodyPositionOutbound struct {
    Id int `json:"id"`
    Username string `json:"username"`

    BodyPosition *BodyPosition `json:"bodyPosition"`
}

type PlayerHeadPositionOutbound struct {
    Id int `json:"id"`
    Username string `json:"username"`

    HeadPosition *HeadPosition `json:"headPosition"`
}

type PlayerMessageOutbound struct {
    Id int `json:"id"`
    Username string `json:"username"`

    Message string `json:"message"`
}


func (playerHandler PlayerHandler) createPlayer(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
      log.Fatal(err)
    }
    player := &Player{Send: make(chan []byte, 256), BodyPosition: &BodyPosition{X: 0.0, Y: 0.0, Z: 0.0, R: 0.0}, HeadPosition: &HeadPosition{X: 0.0, Y: 0.0, Z: 0.0, W: 0.0}, 
      Ws: ws, Room: playerHandler.Room, Username: playerHandler.Username, Id: playerHandler.Id}
    player.Room.Register <- player

    fmt.Println("Created player " + strconv.Itoa(player.Id) + " in room " + strconv.Itoa(player.Room.Id))



    // m := make(map[int]int)
    // m[player.id] = player.id

    // //send coordinates of other players to the new player
    // jsonMessage := "["
    // for p := range player.room.players {
    //     if p.id != player.id{
    //       jsonMessage += "{\"name\": "
    //       jsonMessage += "}"
    //       jsonMessage += "}"
    //     }
    // }  
    // jsonMessage += "]"


    // broadcastStruct := BroadcastStruct{broadcastType: 0, targetIds: m, message: []byte("uhp:" + message)}
    // player.room.broadcast <- &broadcastStruct
    // //send coordinates of the new player to other players
    // broadcastStruct = BroadcastStruct{broadcastType: 2, targetIds: m, message: []byte("uhp:" + message)}
    // player.room.broadcast <- &broadcastStruct  

    defer func() { player.Room.Unregister <- player }()
    go player.writer()
    player.reader()
}


