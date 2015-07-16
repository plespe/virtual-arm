package main

type BroadcastStruct struct {

    //targets to send the message to
    //0 - "targeted" - send message to everyone in the targetIds array
    //1 - "allInRoom" - send message to everyone in the room
    //2 - "allInRoomExcept" - send message to everyone in the room except for the people in the targetIds array
    BroadcastType int

    //ids of the players to send/not send to
    //map used for constant time lookup
    TargetIds map[int]int

    //message to send
    Message []byte

}

type GameRoom struct {
    Id int

    // Registered connections.
    Players map[*Player]*Player //maybe change this to string later for player id

    // Inbound messages from room connections.
    Broadcast chan *BroadcastStruct

    // Register requests from the connections.
    Register chan *Player

    // Unregister requests from connections.
    Unregister chan *Player
}

func createGameRoom(id int) *GameRoom {
    return &GameRoom{
        Id: id,
        Broadcast:   make(chan *BroadcastStruct),
        Register:    make(chan *Player),
        Unregister:  make(chan *Player),
        Players: make(map[*Player]*Player),
    }
}

func (room *GameRoom) run() {
    for {
        select {
        case p := <-room.Register:
            room.Players[p] = p
        case p := <-room.Unregister:
            if _, ok := room.Players[p]; ok {
                delete(room.Players, p)
                close(p.Send)
            }
        case m := <-room.Broadcast:
            //refactor this to not have to look at everyone in the room
            if m.BroadcastType == 0 { //send to specified targets
                for p := range room.Players {
                    _, ok := m.TargetIds[p.Id]
                    if ok {
                        //send message to player if player is in hash table
                        select {
                        case p.Send <- m.Message:
                        default:
                            delete(room.Players, p)
                            close(p.Send)
                        }
                    } else {
                        //don't do anything if player is in the hash table
                    }
                }          
            } else if m.BroadcastType == 1 { //send to everyone in the room
                for p := range room.Players {
                    select {
                    case p.Send <- m.Message:
                    default:
                        delete(room.Players, p)
                        close(p.Send)
                    }
                }  
            } else if(m.BroadcastType == 2) { //send to everyone in the room except for the specified targets
                for p := range room.Players {

                    _, ok := m.TargetIds[p.Id]
                    if ok {
                      //don't do anything if player is in the hash table
                    } else {
                        //else send a message to the player
                        select {
                        case p.Send <- m.Message:
                        default:
                            delete(room.Players, p)
                            close(p.Send)
                        }
                    }
                }                
            }


        }
    }
}
