var Login = React.createClass({
  handleLoginSubmit: function(user){
    //TODO: Send ajax POST request
    console.log(user);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: user,
      success: function(data) {
        this.setState({data: data});
        console.log(data);
      },
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }
    });
  },
  render: function() {
    return (
      <div className="Login">
        <h2>App Name</h2>
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
        <input type="text" placeholder="Username" ref="username" />
        <br/>
        <input type="text" placeholder="Password" ref="password" />
        <input type="submit" value="Submit" />
      </form>
    );
  }
});