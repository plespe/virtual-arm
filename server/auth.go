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

  //"github.com/stretchr/gomniauth"
  //"github.com/stretchr/objx"
  //gomniauthcommon "github.com/stretchr/gomniauth/common"
)

type authHandler struct {
  next http.Handler
}

func (h *authHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  //if cookie, err := r.Cookie("auth"); err == http.ErrNoCookie || cookie.value == "" {
  if cookie, err := r.Cookie("auth"); err == http.ErrNoCookie {
    fmt.Println(cookie)
    w.Header()["Location"] = []string{"/login"}
    w.WriteHeader(http.StatusTemporaryRedirect)
  } else if err != nil {
    panic(err.Error())
  } else {
    h.next.ServeHTTP(w, r)
  }
}

// func MustAuth(handler http.Handler) http.Handler {
//   return &authHandler{next: handler}
// }

func createUserHandler (w http.ResponseWriter, r *http.Request, db *sql.DB) {

    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        panic(err)
    }
    //fmt.Println(string(body))

    byt := body
    var dat map[string]interface{}
    if err := json.Unmarshal(byt, &dat); err != nil {
      panic(err)
    }

    fmt.Println(dat["username"])
    fmt.Println(dat["password"])
    fmt.Println(dat["firstname"])
    fmt.Println(dat["lastname"])    

    // if any of the above fields are blank
    // return error saying so
    for dat := range {
      if dat == nil {
        w.Write([]byte(fmt.Sprintf("Enter all information", dat)))
        w.WriteHeader(http.StatusBadRequest) // or some other status?
      }
    }

    var (
      queried_username string
    )

    // query the database for the username
    err = db.QueryRow("select user_name from users where user_name = ?", username).Scan(&queried_username)
    switch {
    case err == sql.ErrNoRows:
      // if username doesn't exist
        // hash password
        // add username, password, first and last name to database
        // create session
        // redirect to connect (connect will open web socket)
    case err != nil:
            log.Fatal(err)
    default:
      // if username already exists, return error saying so
    } 

}

func loginHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {

    fmt.Println("Authenticating User...")

    if r.Method == "OPTIONS" {
      fmt.Println("options request received")
      w.Header()["access-control-allow-origin"] = []string{"*"}
      w.WriteHeader(http.StatusTemporaryRedirect)
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

    // fmt.Println(dat["username"])
    // fmt.Println(dat["password"])

    username := dat["username"]
    password := dat["password"]

    fmt.Println(password)


   var (
      queried_id int
      queried_password_hash string
    )

    err = db.QueryRow("select id, password_hash from users where user_name = ?", username).Scan(&queried_id, &queried_password_hash)
    switch {
    case err == sql.ErrNoRows:
      // send error back?
      w.Header()["Location"] = []string{"/login"}
      w.WriteHeader(http.StatusTemporaryRedirect)
    case err != nil:
      log.Fatal(err)
    default:
      fmt.Printf("Id is %d\n", queried_id)
      fmt.Printf("Password is %s\n", queried_password_hash)

      authCookieValue := objx.New(map[string]interface{}{
        //what do I put here?
        "userid":     queried_id,
      }).MustBase64()

      http.SetCookie(w, &http.Cookie{
        Name:  "auth",
        Value: authCookieValue,
        // may want to change this route - insecure?
        Path:  "/"})

      w.Header()["Location"] = []string{"/connect"}
      w.WriteHeader(http.StatusTemporaryRedirect)

    }
   //  var (
   //    id int
   //    password_hash string
   //  )

   //  row, err := db.QueryRow("select id, password_hash from users where user_name = ?", username)
   //  if err != nil {
   //    log.Fatal(err)
   //  }
   //  defer row.Close()

   // // not sure what happens when row is empty - still need to handle case

   //  err := row.Scan(&id, &password_hash)
   //  if err != nil {
   //    log.Fatal(err)
   //  }
   //  // check password here and insert different routes
   //  log.Println(id, password)

    // err = row.Err()
    // if err != nil {
    //   log.Fatal(err)
    // }


    // save some data

  // default:
  //   w.Write([]byte(fmt.Sprintf("Auth action %s not supported", action)))
  //   w.WriteHeader(http.StatusNotFound)
  //   break
}

