var Main = React.createClass({
  getInitialState: function(){
    return {
      error: false,
      loggedIn: Auth.loggedIn()
    };
  },
  render: function() {
    return (
      <div className="Main">
        <h3> Main App </h3>
      </div>
    );
  }
});