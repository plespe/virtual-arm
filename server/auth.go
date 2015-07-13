package main

import (
  "crypto/md5"
  "fmt"
  "io"
  "log"
  "net/http"
  "strings"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"

  "github.com/stretchr/gomniauth"
  "github.com/stretchr/objx"
)

import gomniauthcommon "github.com/stretchr/gomniauth/common"

type authHandler struct {
  next http.Handler
}

db, err := sql.Open("mysql",
  // db address goes here:
"user:password@tcp(127.0.0.1:3306)/hello")
if err != nil {
  log.Fatal(err)
}
defer db.Close()

func (h *authHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  if cookie, err := r.Cookie("auth"); err == http.ErrNoCookie || cookie.value == "" {
    w.Header()["Location"] = []string{"/login"}
    w.WriteHeader(http.StatusTemporaryRedirect)
  } else if err != nil {
    panic(err.Error())
  } else {
    h.next.ServeHTTP(w, r)
  }
}

func MustAuth(handler http.Handler) http.Handler {
  return &authHandler{next: handler}
}

func loginHandler (w http.ResponseWriter, r *http.Request) {

    var (
      id int
      password_hash string
    )

    row, err := db.QueryRow("select id, password_hash from users where user_name = ?", username)
    if err != nil {
      log.Fatal(err)
    }
    defer row.Close()

   // not sure what happens when row is empty - still need to handle case

    err := row.Scan(&id, &password_hash)
    if err != nil {
      log.Fatal(err)
    }
    // check password here and insert different routes
    log.Println(id, password)

    err = row.Err()
    if err != nil {
      log.Fatal(err)
    }

    // save some data
    authCookieValue := objx.New(map[string]interface{}{
      "userid":     chatUser.uniqueID,
      "name":       user.Name(),
    }).MustBase64()

    http.SetCookie(w, &http.Cookie{
      Name:  "auth",
      Value: authCookieValue,
      Path:  "/"})

    w.Header()["Location"] = []string{"/chat"}
    w.WriteHeader(http.StatusTemporaryRedirect)
    break

  // default:
  //   w.Write([]byte(fmt.Sprintf("Auth action %s not supported", action)))
  //   w.WriteHeader(http.StatusNotFound)
  //   break
  }
}

