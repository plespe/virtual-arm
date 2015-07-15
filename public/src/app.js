var Router = window.ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Route = ReactRouter.Route;
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;

var Link = ReactRouter.Link;

var App = React.createClass({
  getInitialState: function(){
    if(!Auth.loggedIn()){
      location.hash = '/login';
    }else{
      location.hash = '/game';
    }
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
  render: function(){
    return (
      <div>
          {this.state.loggedIn ? (
            <Link className="btn btn-warning" to="/logout">Log out</Link>
          ) : (
            <Link className="btn btn-info" to="/login">Sign in</Link>
          )}
        <h1>App</h1>
        <RouteHandler/>
      </div>
      );
  }
});

// Currently does not work.
function requireAuth(nextState, transition) {
  if (!Auth.loggedIn()){
    // TODO: stop transition or transition backto login.
    // transition.to('/login', null, { nextPathname: nextState.location.pathname });
    location.hash = '/login';
  }
}

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Login}/>
    <Route path="login" handler={Login}/>
    <Route path="logout" handler={Logout}/>
    <Route path="signup" handler={Signup}/>
    <Route path="game" handler={Game} onEnter={requireAuth()}/>
  </Route>
);

Router.run(routes, Router.HashLocation, function(Root){
  React.render(<Root/>, document.getElementById('content'));
});

// React.render(
//   <Login />,
//   document.getElementById('content')
// );