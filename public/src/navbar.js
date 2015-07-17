var Navbar = React.createClass({

  getInitialState: function(){
    return {
      loggedIn: Auth.loggedIn()
    };
  },
  setStateOnAuth: function(loggedIn){
    this.setState({
      loggedIn: loggedIn
    });
  },

  componentWillMount: function(){
    Auth.onChange = this.setStateOnAuth;
  },

  navlogout: function(){
    Auth.logout(function(){
      location.hash = '/login';
    });
    this.setState({
      loggedIn: false
    });
  },

  handleSubmit: function(e){
    e.preventDefault();
    var username = React.findDOMNode(this.refs.username).value.trim();
    var password = React.findDOMNode(this.refs.password).value.trim();
    if(!username || !password){
      return;
    }
    // TODO: send request to server
    this.handleLoginSubmit({username: username, password: password});
    React.findDOMNode(this.refs.username).value = '';
    React.findDOMNode(this.refs.password).value = '';
    return;
  },

  handleLoginSubmit: function(user){
    var that = this;
    Auth.login(user.username,user.password,function(authenticated){
      if(authenticated){
        // TODO: redirect to game
        // location.hash = '/game';
      }else{
        // TODO: Display warning message - no go
        return that.setState({ error: true });
      }
    });
  },

  render: function(){
    return (
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">

        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">BSun VR</a>
        </div>
        
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">

          {this.state.loggedIn ? (
            <form className="navbar-form navbar-right" role="login">
              <div className="form-group">
                <Link className="btn btn-warning" to="/logout" onClick={this.navlogout}>Log out</Link>
              </div>
            </form>
          ) : (
            <form className="navbar-form navbar-right" role="login" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Username" ref="username" />
                <input type="text" className="form-control" placeholder="Password" ref="password" />
                <button type="submit" className="btn btn-success hidden" value="Submit">Submit</button>
              </div>
            </form>
          )}

            <li className="active"><a href="#">Link <span className="sr-only">(current)</span></a></li>
            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="#">Separated link</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="#">One more separated link</a></li>
              </ul>
            </li>
            <li><Link to="/signup">Register</Link></li>
          </ul>
        </div>

      </div>
    </nav>
    )
  }

});