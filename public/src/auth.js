var authenticateUser = function(username, password, callback) {
  return $.ajax('/authenticate', {
    type: 'POST',
    data: {
      username: username,
      password: password
    },
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
    if (this.loggedIn()) {
      if (callback) {
        callback(true);
      }
      this.onChange(true);
      return;
    }
    return authenticateUser(username, pass, (function(_this) {
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