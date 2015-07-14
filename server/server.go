package main

import (
    "fmt"
    "net/http"
    "flag"    
    "log"
    //"strings"
    //"go/build"
    //"path/filepath"
    "text/template"   
    "database/sql"
    _ "github.com/go-sql-driver/mysql"    
)

const (
    DB_USER = "root"
    DB_PASSWORD = ""
    DB_NAME = "virtual_arm"
)

var (
    addr      = flag.String("addr", ":8080", "http service address")
    homeTempl *template.Template
    signupTempl *template.Template
)

func initializeDB() *sql.DB {
        db, err := sql.Open("mysql",  DB_USER + ":" + DB_PASSWORD + "@/" + DB_NAME)
        if err != nil {
          panic(err)
        } 

        return db
}

func homeHandler(c http.ResponseWriter, req *http.Request) {
    homeTempl.Execute(c, req.Host)
}
func signupHandler(c http.ResponseWriter, req *http.Request) {
    signupTempl.Execute(c, req.Host)
}

func main() {
    flag.Parse()

    var db = initializeDB()
    defer db.Close()

    //create the game room
    var room = createGameRoom()
    go room.run()

    //serve the home page
    homeTempl = template.Must(template.ParseFiles("home.html"))
    http.HandleFunc("/", homeHandler)

    //serve the signup page
    signupTempl = template.Must(template.ParseFiles("signup.html"))
    http.HandleFunc("/signup", signupHandler)
    http.HandleFunc("/signup.html", signupHandler)

    //allow user to sign up
    http.HandleFunc("/createUser", func(w http.ResponseWriter, r *http.Request) {
        createUserHandler(w, r, db)
    })    

    //authenticate user
    http.HandleFunc("/authenticate", func(w http.ResponseWriter, r *http.Request) {
        fmt.Println("hi")
        loginHandler(w, r, db)
    })

    //listen for player connection
    http.HandleFunc("/connect", func(w http.ResponseWriter, r *http.Request) {
        fmt.Println("trying to connect websocket")
        connect(w, r, room)
    })

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
