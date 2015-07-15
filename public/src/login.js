var Login = React.createClass({
  getInitialState: function(){
    return {
      loggedIn: Auth.loggedIn()
    };
  },
  handleLoginSubmit: function(user){
    Auth.login(user.username,user.password,function(authenticated){
      if(authenticated){
        // TODO: redirect to game
        
      }else{
        // TODO: Display warning message - no go
      }
    });
  },
  render: function() {
    return (
      <div className="Auth center-block">
        <h2>Login</h2>
          <LoginForm onLoginSubmit={this.handleLoginSubmit}/>
      </div>
    );
  }
});

var LoginForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var username = React.findDOMNode(this.refs.username).value.trim();
    var password = React.findDOMNode(this.refs.password).value.trim();
    if(!username || !password){
      return;
    }
    // TODO: send request to server
    this.props.onLoginSubmit({username: username, password: password});
    React.findDOMNode(this.refs.username).value = '';
    React.findDOMNode(this.refs.password).value = '';
    return;
  },
  render: function(){
    return (
      <form className="loginForm" onSubmit={this.handleSubmit}>
        <input type="text" className="form-control" placeholder="Username" ref="username" />
        <input type="password" className="form-control" placeholder="Password" ref="password" />
        <button type="submit" className="btn btn-success" value="Submit">Submit</button>
      </form>
    );
  }
});