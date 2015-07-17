package main

import (
  //"crypto/md5"
  "fmt"
  //"io"
  "log"
  "net/http"
  //"strings"
  "encoding/json"
  "io/ioutil"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
  "golang.org/x/crypto/bcrypt"
  "github.com/gorilla/sessions"   
)


//TODO: handle panics/errors, as unhandled panics/errors will shut down the server


//function that adds a user to the database
//TODO: fix all Writes to respond to the clients with the correct status
func createUserHandler (w http.ResponseWriter, r *http.Request, db *sql.DB) {

  fmt.Println("Signing up user...")

  //add headers to response
  w.Header()["Access-Control-Allow-Origin"] = []string{"http://localhost:8080"} //TODO: fix this?
  w.Header()["access-control-allow-methods"] = []string{"GET, POST, OPTIONS"}
  w.Header()["content-type"] = []string{"application/json"}

  //ignore options requests
  if r.Method == "OPTIONS" {
    fmt.Println("options request received")
    w.WriteHeader(http.StatusTemporaryRedirect)
    return
  }

  //parse the body of the request into a string
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    panic(err)
  }
  //fmt.Println(string(body))
  
  //parse the JSON string body to get the username, password, firstname, and lastname
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  username := dat["username"].(string)
  password := dat["password"].(string)
  first := dat["firstname"].(string)
  last := dat["lastname"].(string)

  //if any of the above fields are blank, return an error saying so
  for key, value := range dat {
    if value == "" {
      fmt.Println("about to write 400 header")
      w.Write([]byte(fmt.Sprintf("Enter information for ", key)))
      return
    }
  }

  //variable(s) to hold the returned values from the query
  var (
    queried_username string
  )

  //query the database for the username
  err = db.QueryRow("select user_name from users where user_name = ?", username).Scan(&queried_username)
  switch {

  //if username doesn't exist
  case err == sql.ErrNoRows:
    //hash the password
    hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
    if err != nil {
      fmt.Println(err)
    }
    fmt.Println("hash is ", string(hash))

    //add username, password, firstname, and lastname to database
    stmt, err := db.Prepare("insert into users (user_name, first_name, last_name, password_hash) values (?, ?, ?, ?)")
    if err != nil {
      log.Fatal(err)
    }
    res, err := stmt.Exec(username, first, last, string(hash))
    if err != nil {
      log.Fatal(err)
    }
    lastId, err := res.LastInsertId()
    if err != nil {
      log.Fatal(err)
    }
    rowCnt, err := res.RowsAffected()
    if err != nil {
      log.Fatal(err)
    }
    fmt.Println("Inserted user " + username + " into database. Last inserted ID = %d, rows affected = %d\n", lastId, rowCnt)

    //create session for signed up player
    session, err := store.Get(r, "flash-session")
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
    }
    session.Values["id"] = lastId
    session.Values["username"] = username   
    session.AddFlash("This is a flashed message!", "message")
    session.Save(r, w) 
    
    //return 200 status to indicate success
    fmt.Println("about to write 200 header")
    w.WriteHeader(http.StatusOK)
    break

  //if error querying database
  case err != nil:
    log.Fatal(err)
    //return 400 status to indicate error
    fmt.Println("about to write 400 header")
    w.Write([]byte(fmt.Sprintf("Error querying database")))  
    break
  
  //if username exists
  default:
    //return 400 status to indicate error
    fmt.Println("about to write 400 header")
    w.Write([]byte(fmt.Sprintf("Username is already taken")))
    break
  } 

}

//function that authenticates/signs in user
//TODO: fix all Writes to respond to the clients with the correct status
//TODO: handle logging in when a session is already assigned to client
func loginHandler(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) {

  fmt.Println("Authenticating User...")

  //add headers to response
  w.Header()["access-control-allow-origin"] = []string{"http://localhost:8080"} //TODO: fix this?                                                           
  w.Header()["access-control-allow-methods"] = []string{"GET, POST, OPTIONS"}
  w.Header()["Content-Type"] = []string{"application/json"}

  //ignore options requests
  if r.Method == "OPTIONS" {
    fmt.Println("options request received")
    w.WriteHeader(http.StatusTemporaryRedirect)
    return
  }

  //parse the body of the request into a string
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    panic(err)
  }
  //fmt.Println(string(body))

  //parse the JSON string body to get the username and password
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  username := dat["username"].(string)
  password := dat["password"].(string)

  //variable(s) to hold the returned values from the query
  var (
    queried_id int
    queried_password_hash string
  )

  //query the database for the username
  err = db.QueryRow("select id, password_hash from users where user_name = ?", username).Scan(&queried_id, &queried_password_hash)
  switch {

  //if username doesn't exist   
  case err == sql.ErrNoRows:
    //return 400 status to indicate error
    fmt.Println("about to write 400 header")
    fmt.Println("Username cannot be found")     
    w.Write([]byte(fmt.Sprintf("Username cannot be found"))) 
    break

  //if error querying database  
  case err != nil:
    log.Fatal(err)
    //return 400 status to indicate error
    fmt.Println("about to write 400 header")
    w.Write([]byte(fmt.Sprintf("Error querying database")))  

  //if username exists  
  default:
    //fmt.Println("Retrieved Id is %d\n", queried_id)
    //fmt.Println("Retrieved Password is %s\n", queried_password_hash)

    //compare the retrieved password to the password sent by the client
    err := bcrypt.CompareHashAndPassword([]byte(queried_password_hash), []byte(password))
    if err != nil { 
      //password not a match

      //return 400 status to indicate error
      fmt.Println("about to write 400 header")
      fmt.Println("Password incorrect")     
      w.Write([]byte(fmt.Sprintf("Password incorrect")))     
    } else { 
      //user is authorized

      //create session
      session, err := store.Get(r, "flash-session")
      if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
      }
      session.Values["id"] = queried_id
      session.Values["username"] = username
      session.AddFlash("This is a flashed message!", "message")
      session.Save(r, w)

      //return 200 status to indicate success
      fmt.Println("about to write 200 header")
      fmt.Println("password correct") 
      w.WriteHeader(http.StatusOK)
    }

    break
  }

}

