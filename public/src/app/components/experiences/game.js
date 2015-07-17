var Game = React.createClass({
  getInitialState: function(){
    if(!Auth.loggedIn()){
      location.hash = '/login';
    }else{
      location.hash = '/vr';
    }
    return {
      loggedIn: Auth.loggedIn()
    };
  },
  render: function() {
    return (
      <div className="Auth center-block">
        <h2>This is 3JS Game</h2>
      </div>
    );
  }
});