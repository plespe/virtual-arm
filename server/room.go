package main

type GameRoom struct {
    id string

    // Registered connections.
    players map[*Player]*Player //maybe change this to string later for player id

    // Inbound messages from troome connections.
    broadcast chan []byte

    // Register requests from the connections.
    register chan *Player

    // Unregister requests from connections.
    unregister chan *Player
}

func createGameRoom() *GameRoom {
    return &GameRoom{
        id: "CHANGE ThIS!!!",
        broadcast:   make(chan []byte),
        register:    make(chan *Player),
        unregister:  make(chan *Player),
        players: make(map[*Player]*Player),
    }
}

func (room *GameRoom) run() {
    for {
        select {
        case p := <-room.register:
            room.players[p] = p
        case p := <-room.unregister:
            if _, ok := room.players[p]; ok {
                delete(room.players, p)
                close(p.send)
            }
        case m := <-room.broadcast:
            for p := range room.players {
                select {
                case p.send <- m:
                default:
                    delete(room.players, p)
                    close(p.send)
                }
            }
        }
    }
}
