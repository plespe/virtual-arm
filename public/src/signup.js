var Signup = React.createClass({
  getInitialState: function(){
    if(Auth.loggedIn()){
      location.hash = '/game';
    }
    return {
      loggedIn: Auth.loggedIn()
    };
  },
  handleSignupSubmit: function(user){
    Auth.signup(user.username,user.password,user.firstname,user.lastname,function(authenticated){
      if(authenticated){
        location.hash = '/game';
      }else{
        // TODO: Display warning message - no go
      }
    });
  },
  render: function() {
    return (
      <div className="Auth center-block">
        <h2>Sign up</h2>
          <SignupForm onSignupSubmit={this.handleSignupSubmit}/>
      </div>
    );
  }
});

var SignupForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var firstname = React.findDOMNode(this.refs.firstname).value.trim();
    var lastname = React.findDOMNode(this.refs.lastname).value.trim();
    var username = React.findDOMNode(this.refs.username).value.trim();
    var password = React.findDOMNode(this.refs.password).value.trim();
    var passconf = React.findDOMNode(this.refs.passconf).value.trim();
    if(!firstname || !lastname || !username || !password || !passconf){
      return;
    }
    // TODO: send request to server
    this.props.onSignupSubmit({firstname: firstname, lastname: lastname, username: username, password: password});
    React.findDOMNode(this.refs.firstname).value = '';
    React.findDOMNode(this.refs.lastname).value = '';
    React.findDOMNode(this.refs.username).value = '';
    React.findDOMNode(this.refs.password).value = '';
    React.findDOMNode(this.refs.passconf).value = '';
    return;
  },
  render: function(){
    return (
      <form className="signupForm" onSubmit={this.handleSubmit}>
        <div className="nameField">
          <input name="first" type="text" className="form-control" placeholder="First" ref="firstname" />
          <input name="last" type="text" className="form-control" placeholder="Last" ref="lastname" />
        </div>
        <input type="text" className="form-control" placeholder="Username" ref="username" />
        <input type="password" className="form-control" placeholder="Password" ref="password" />
        <input type="password" className="form-control" placeholder="Confirm" ref="passconf" />
        <button type="submit" className="btn btn-success" value="Submit">Submit</button>
      </form>
    );
  }
});