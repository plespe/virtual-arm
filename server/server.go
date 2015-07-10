package main

import (
    "flag"
    "fmt"
    "net/http"
    //"net/url"
    "log"
    //"strings"
    //"go/build"
    //"path/filepath"
    "text/template"   
)

var (
    addr      = flag.String("addr", ":8080", "http service address")
    homeTempl *template.Template
)

func homeHandler(c http.ResponseWriter, req *http.Request) {
    homeTempl.Execute(c, req.Host)
}

func main() {
    flag.Parse()

    //create the game room
    var room = createGameRoom()
    go room.run()

    //serve the home page
    homeTempl = template.Must(template.ParseFiles("home.html"))
    http.HandleFunc("/", homeHandler)

    //listen for player connection
    http.HandleFunc("/connect", func(w http.ResponseWriter, r *http.Request) {
        connect(w, r, room)
    })

    //http.HandleFunc("/hello", hello)
    // http.HandleFunc("/wait/", Wait)
    // http.HandleFunc("/create/", Create)
    // http.HandleFunc("/send/", Send)
    // http.HandleFunc("/receive/", Receive)

    fmt.Println("Server starting")
    err := http.ListenAndServe(*addr, nil)
    if err != nil {
        log.Fatal("ListenAndServe:", err)
    }
}

func connect(c http.ResponseWriter, req *http.Request, room *GameRoom) {
    fmt.Println("New user connected")

    playerHandler := PlayerHandler{room: room}

    playerHandler.createPlayer(c, req)
}
