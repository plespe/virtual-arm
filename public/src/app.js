// var ReactRouter = window.ReactRouter;
var Router = window.ReactRouter;
var Route = ReactRouter.Route;
var RouteHandler = Router.RouteHandler;
var Link = ReactRouter.Link;

var App = React.createClass({
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
  <Route handler={App}>
    <Route path="login" handler={Login}/>
  </Route>
);

Router.run(routes, Router.HashLocation, function(Root){
  React.render(<Root/>, document.getElementById('content'));
});

// React.render(
//   <Login />,
//   document.getElementById('content')
// );