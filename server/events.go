package main

import (
    "fmt"    
)

func handleEvent(eventName string, messageContents string) {
  switch {
    case eventName == "updateBodyPosition":
      fmt.Println(eventName) 
      fmt.Println(messageContents) 
      break
    case eventName == "updateHeadPosition":
      fmt.Println("updateHeadPosition")
      break
    case eventName == "recvMessage":
      fmt.Println("recvMessage")
      break  
    default:
      break 
  } 
}


func evt_updatePlayerPosition(message string) {
  
}


func evt_sendMessage(message string) {
  //player.room.broadcast <- message
}