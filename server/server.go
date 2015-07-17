package main

import (
  "fmt"
  "net/http"
  "flag"    
  "log"
  //"strings"
  //"go/build"
  //"path/filepath"
  //"html/template"   
  "database/sql"
  _ "github.com/go-sql-driver/mysql" 
  "github.com/gorilla/sessions"   
)

//"constant" variables to be used throughout the program
const (
  //database configuration information
  DB_USER = "root"
  DB_PASSWORD = ""
  DB_NAME = "virtual_arm"
)

//variables to be used throughout the program
var (
  //cookie information
  store = sessions.NewCookieStore([]byte("a-secret-string"))

  //server address information
  addr = flag.String("addr", ":8080", "http service address")  
)

func main() {
  flag.Parse()

  //open the database connection
  var db = initializeDB()
  defer db.Close() //defer closing the connection

  //create the game room
  var room = createGameRoom(1)
  go room.run()

  //serve static assets
  http.Handle("/", http.FileServer(http.Dir("../public")))

  //allow user to sign up
  http.HandleFunc("/createUser", func(w http.ResponseWriter, r *http.Request) {
    createUserHandler(w, r, db)
  })    

  //authenticate user
  http.HandleFunc("/authenticate", func(w http.ResponseWriter, r *http.Request) {
    loginHandler(w, r, db, store)
  })

  //listen for player connection
  http.HandleFunc("/connect", func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("trying to connect websocket")
    connect(w, r, room, store)
  })

  //listen on specified port
  fmt.Println("Server starting")
  err := http.ListenAndServe(*addr, nil)
  if err != nil {
    log.Fatal("ListenAndServe:", err)
  }
}

//function to open connection with database
func initializeDB() *sql.DB {
  db, err := sql.Open("mysql",  DB_USER + ":" + DB_PASSWORD + "@/" + DB_NAME)
  if err != nil {
    panic(err)
  } 

  return db
}

//handle the connect event which checks if the cookie corresponds to a logged in user
//and creates the player in the game
//TODO: Return correct status and message if session is invalid
func connect(w http.ResponseWriter, r *http.Request, room *GameRoom, store *sessions.CookieStore) {

  //check for session to see if client is authenticated
  session, err := store.Get(r, "flash-session")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
  }
  fm := session.Flashes("message")
  if fm == nil {
    fmt.Println("Trying to log in as invalid user")
    fmt.Fprint(w, "No flash messages")
    return
  }
  session.Save(r, w)

  fmt.Println("New user connected")

  //use the id and username attached to the session to create the player
  playerHandler := PlayerHandler{Id: session.Values["id"].(int), Username: session.Values["username"].(string), Room: room}

  playerHandler.createPlayer(w, r)
}
