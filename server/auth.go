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

  //"github.com/stretchr/objx"

)


// type authHandler struct {
//   next http.Handler
// }

// func (h *authHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
//   //if cookie, err := r.Cookie("auth"); err == http.ErrNoCookie || cookie.value == "" {
//   if cookie, err := r.Cookie("auth"); err == http.ErrNoCookie {
//     fmt.Println(cookie)
//     w.Header()["Location"] = []string{"/login"}
//     w.WriteHeader(http.StatusTemporaryRedirect)
//   } else if err != nil {
//     panic(err.Error())
//   } else {
//     h.next.ServeHTTP(w, r)
//   }
// }

// func MustAuth(handler http.Handler) http.Handler {
//   return &authHandler{next: handler}
// }


func createUserHandler (w http.ResponseWriter, r *http.Request, db *sql.DB) {
    fmt.Println("inside createUserHandler")

    w.Header()["Access-Control-Allow-Origin"] = []string{"http://localhost:8080"}
    w.Header()["access-control-allow-methods"] = []string{"GET, POST, OPTIONS"}
    w.Header()["content-type"] = []string{"application/json"}

    if r.Method == "OPTIONS" {
      fmt.Println("options request received")
      w.WriteHeader(http.StatusTemporaryRedirect)
      return
    }

    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        panic(err)
    }

    fmt.Println(string(body))
    byt := body
    var dat map[string]interface{}
    if err := json.Unmarshal(byt, &dat); err != nil {
      panic(err)
    }

    username := dat["username"].(string)
    password := dat["password"].(string)
    first := dat["firstname"].(string)
    last := dat["lastname"].(string)

    // if any of the above fields are blank
    // return error saying so
    for key, value := range dat {
      if value == "" {
        fmt.Println("about to write 400 header")
        w.Write([]byte(fmt.Sprintf("Enter information for ", key)))
        return
      }
    }
    // fmt.Println(w.Header())

    var (
      queried_username string
    )

    // query the database for the username
    err = db.QueryRow("select user_name from users where user_name = ?", username).Scan(&queried_username)
    switch {
    // if username doesn't exist
    case err == sql.ErrNoRows:
        // hash password
        hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
        if err != nil {
          fmt.Println(err)
        }
        fmt.Println("hash is ", string(hash))

        // add username, password, first and last name to database
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
        log.Printf("ID = %d, affected = %d\n", lastId, rowCnt)

        // authCookieValue := objx.New(map[string]interface{}{
        //   //what do I put here?
        //   "userid":     lastId,
        //   }).MustBase64()

        // http.SetCookie(w, &http.Cookie{
        //   Name:  "auth",
        //   Value: authCookieValue,
        //   // may want to change this route - insecure?
        //   Path:  "/"})

        // create session
        session, err := store.Get(r, "flash-session")
        if err != nil {
          http.Error(w, err.Error(), http.StatusInternalServerError)
        }
        session.AddFlash("This is a flashed message!", "message")
        session.Save(r, w) 
        
        // redirect to connect (connect will open web socket)
        //w.Header()["Location"] = []string{"/connect"}
        fmt.Println("about to write 200 header")
        w.WriteHeader(http.StatusOK)
        break
    case err != nil:
        log.Fatal(err)
        break
    // if username exists
    default:
        fmt.Println("about to write 400 header")
        w.Write([]byte(fmt.Sprintf("Username is already taken")))
        break
    } 

}

func loginHandler(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) {

    fmt.Println("Authenticating User...")

    w.Header()["access-control-allow-origin"] = []string{"http://localhost:8080"}                                                             
    w.Header()["access-control-allow-methods"] = []string{"GET, POST, OPTIONS"}
    w.Header()["Content-Type"] = []string{"application/json"}

    if r.Method == "OPTIONS" {
      fmt.Println("options request received")
      w.WriteHeader(http.StatusTemporaryRedirect)
      return
    }

    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        panic(err)
    }
    // fmt.Println(string(body))

    byt := body
    var dat map[string]interface{}
    if err := json.Unmarshal(byt, &dat); err != nil {
      panic(err)
    }

    username := dat["username"].(string)
    password := dat["password"].(string)

    fmt.Println(password)


    var (
      queried_id int
      queried_password_hash string
    )

    err = db.QueryRow("select id, password_hash from users where user_name = ?", username).Scan(&queried_id, &queried_password_hash)
    switch {
    // if username doesn't exist   
    case err == sql.ErrNoRows:
      // send error back?
      w.Header()["Location"] = []string{"/login"}
      // w.WriteHeader(http.StatusTemporaryRedirect)
      fmt.Println("about to write 400 header")
      fmt.Println("Username cannot be found")     
      w.Write([]byte(fmt.Sprintf("Username cannot be found"))) 
      break
    case err != nil:
      log.Fatal(err)
    default:
      fmt.Printf("Retrieved Id is %d\n", queried_id)
      fmt.Printf("Retrieved Password is %s\n", queried_password_hash)

      err := bcrypt.CompareHashAndPassword([]byte(queried_password_hash), []byte(password))
      if err != nil {
          //password not a match
          w.Header()["Location"] = []string{"/login"}
          fmt.Println("about to write 400 header")
          fmt.Println("Password incorrect")     
          w.Write([]byte(fmt.Sprintf("Password incorrect")))     
      } else {
        // user is authorized

        // authCookieValue := objx.New(map[string]interface{}{
        //   //what do I put here?
        //   "userid":     queried_id,
        // }).MustBase64()

        // http.SetCookie(w, &http.Cookie{
        //   Name:  "auth",
        //   Value: authCookieValue,
        //   // may want to change this route - insecure?
        //   Path:  "/"})

        // create session
        session, err := store.Get(r, "flash-session")
        if err != nil {
          http.Error(w, err.Error(), http.StatusInternalServerError)
        }
        session.AddFlash("This is a flashed message!", "message")
        session.Save(r, w)

        w.Header()["Location"] = []string{"/connect"}
        fmt.Println("about to write 200 header")
        fmt.Println("password correct") 
        w.WriteHeader(http.StatusOK)
      }

      break

    }
}

