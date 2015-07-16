package main

import (
    "encoding/json"
    "fmt"    
)


func handleEvent(eventName string, messageContents string, player *Player) {
  switch {

    case eventName == "cp": //createPlayer
      evt_createPlayer(player)
      break
    case eventName == "np": //newPlayer
      evt_newPlayer(player)
      break

    case eventName == "ubp": //updateBodyPosition
      evt_updatePlayerBodyPosition(messageContents, player)
      break
    case eventName == "uhp": //updateHeadPosition
      evt_updatePlayerHeadPosition(messageContents, player)
      break
    case eventName == "sm": //sendMessage
      evt_sendMessage(messageContents, player)
      break  
    default:
      break 
  } 
}

func evt_createPlayer(player *Player) {
    //send coordinates of other players to the new player
    playerPositionListOutbound := PlayerPositionListOutbound{Players: make([]*PlayerPositionOutbound, 0)}
    for p := range player.Room.Players {
        if p.Id != player.Id{
          playerPositionOutbound := PlayerPositionOutbound{Id: p.Id, Username: p.Username, BodyPosition: p.BodyPosition, HeadPosition: p.HeadPosition}
          playerPositionListOutbound.Players = append(playerPositionListOutbound.Players, &playerPositionOutbound)
        }
    }  

    jsonString, err := json.Marshal(playerPositionListOutbound)
    if err != nil {
      panic(err)
    }

    fmt.Println(string(jsonString))

    m := make(map[int]int)
    m[player.Id] = player.Id
    broadcastStruct := BroadcastStruct{BroadcastType: 0, TargetIds: m, Message: []byte("cp:" + string(jsonString))}
    player.Room.Broadcast <- &broadcastStruct
}

func evt_newPlayer(player *Player) {
    //send initial player creation information
    playerPositionOutbound := PlayerPositionOutbound{Id: player.Id, Username: player.Username, BodyPosition: player.BodyPosition, HeadPosition: player.HeadPosition}

    jsonString, err := json.Marshal(playerPositionOutbound)
    if err != nil {
      panic(err)
    }

    fmt.Println(string(jsonString))

    m := make(map[int]int)
    m[player.Id] = player.Id
    broadcastStruct := BroadcastStruct{BroadcastType: 2, TargetIds: m, Message: []byte("np:" + string(jsonString))}
    player.Room.Broadcast <- &broadcastStruct
}


//ubp:{"x": 1.0, "y": 2.0, "z": 3.0, "r": 4.0}
func evt_updatePlayerBodyPosition(message string, player *Player) {
  byt := []byte(message)
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  x := float32(dat["x"].(float64))
  y := float32(dat["y"].(float64))
  z := float32(dat["z"].(float64))
  r := float32(dat["r"].(float64)) 
  player.updateBodyPosition(x, y, z, r)


  playerBodyPositionOutbound := PlayerBodyPositionOutbound{Id: player.Id, Username: player.Username, BodyPosition: player.BodyPosition}

  jsonString, err := json.Marshal(playerBodyPositionOutbound)
  if err != nil {
    panic(err)
  }

  fmt.Println(string(jsonString))


  m := make(map[int]int)
  m[player.Id] = player.Id
  broadcastStruct := BroadcastStruct{BroadcastType: 2, TargetIds: m, Message: []byte("ubp:" + string(jsonString))}
  player.Room.Broadcast <- &broadcastStruct
}

//uhp:{"x": 1.0, "y": 2.0, "z": 3.0, "w": 4.0}
func evt_updatePlayerHeadPosition(message string, player *Player) {
  byt := []byte(message)
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  x := float32(dat["x"].(float64))
  y := float32(dat["y"].(float64))
  z := float32(dat["z"].(float64))
  w := float32(dat["w"].(float64))    
  player.updateHeadPosition(x, y, z, w)


  playerHeadPositionOutbound := PlayerHeadPositionOutbound{Id: player.Id, Username: player.Username, HeadPosition: player.HeadPosition}

  jsonString, err := json.Marshal(playerHeadPositionOutbound)
  if err != nil {
    panic(err)
  }

  fmt.Println(string(jsonString))


  m := make(map[int]int)
  m[player.Id] = player.Id
  broadcastStruct := BroadcastStruct{BroadcastType: 2, TargetIds: m, Message: []byte("uhp:" + string(jsonString))}
  player.Room.Broadcast <- &broadcastStruct   
}

//sm:test
func evt_sendMessage(message string, player *Player) {


  playerMessageOutbound := PlayerMessageOutbound{Id: player.Id, Username: player.Username, Message: message}

  jsonString, err := json.Marshal(playerMessageOutbound)
  if err != nil {
    panic(err)
  }

  fmt.Println(string(jsonString))


  m := make(map[int]int)
  m[player.Id] = player.Id
  broadcastStruct := BroadcastStruct{BroadcastType: 2, TargetIds: m, Message: []byte("sm:" + string(jsonString))}
  player.Room.Broadcast <- &broadcastStruct  
}
