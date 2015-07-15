var authenticateUser = function(username, password, callback) {
  $.ajax({
    type: 'POST',
    url: '/authenticate',
    data: JSON.stringify({
      username: username,
      password: password
    }),
    crossDomain: true,
    success: function(resp) {
      console.log('success',resp);
      callback({
        authenticated: true,
        token: resp.auth_token
      });
    },
    error: function(resp) {
      console.log('error',resp);
      callback({
        authenticated: false
      });
    }
  });
};

var createUser = function(username, password, firstname, lastname, callback) {
  return $.ajax('/createUser', {
    type: 'POST',
    data: JSON.stringify({
      "username": username,
      "password": password,
      "firstname": firstname,
      "lastname": lastname
    }),
    // contentType: "application/json",
    success: function(resp) {
      return callback({
        authenticated: true,
        token: resp.auth_token
      });
    },
    error: function(resp) {
      return callback({
        authenticated: false
      });
    }
  });
};

var Auth = {
  login: function(username, pass, callback) {
    console.log('trying to log in...');

    if (this.loggedIn()) {
      console.log('already logged in');
      if (callback) {
        callback(true);
      }
      this.onChange(true);
      return;
    }
    authenticateUser(username, pass, (function(res) {
        var authenticated = false;
        if (res.authenticated) {
          localStorage.token = res.token;
          authenticated = true;
        }
        if (callback) {
          callback(authenticated);
        }
    }));
  },
  signup: function(username, password, firstname, lastname, callback) {
    if (this.loggedIn()) {
      if (callback) {
        callback(true);
      }
      this.onChange(true);
      return;
    }
    return createUser(username, password, firstname, lastname, (function(_this) {
      return function(res) {
        var authenticated = false;
        if (res.authenticated) {
          localStorage.token = res.token;
          authenticated = true;
        }
        if (callback) {
          callback(authenticated);
        }
        return _this.onChange(authenticated);
      };
    })(this));
  },
  getToken: function() {
    return localStorage.token;
  },
  logout: function(callback) {
    delete localStorage.token;
    if (callback) {
      callback();
    }
    return this.onChange(false);
  },
  loggedIn: function() {
    return !!localStorage.token;
  },
  onChange: function() {}
};