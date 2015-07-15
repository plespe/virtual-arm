var Router = window.ReactRouter;
var Route = ReactRouter.Route;
var RouteHandler = Router.RouteHandler;
var Link = ReactRouter.Link;

var App = React.createClass({
  getInitialState: function(){
    console.log(Auth.loggedIn());
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
        <h1>App</h1>
        <RouteHandler/>
      </div>
      );
  }
});

var routes = (
  <Route path="/" handler={App}>
    <Route path="login" handler={Login}/>
    <Route path="signup" handler={Signup}/>
  </Route>
);

Router.run(routes, Router.HashLocation, function(Root){
  React.render(<Root/>, document.getElementById('content'));
});

// React.render(
//   <Login />,
//   document.getElementById('content')
// );