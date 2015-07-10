package main

import (
    "encoding/json"
    //"fmt"    
)

func handleEvent(eventName string, messageContents string, player *Player) {
  switch {
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
  player.room.broadcast <- []byte("ubp:" + message)
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
  player.room.broadcast <- []byte("uhp:" + message)
}

//sm:test
func evt_sendMessage(message string, player *Player) {
  player.room.broadcast <- []byte("sm:" + message)
}
