var Main = React.createClass({
  getInitialState: function(){
    return {
      error: false,
      loggedIn: Auth.loggedIn()
    };
  },
  render: function() {
    return (
      <div className="main">
        <div className="row col-md-8 ">
          
        </div>
        
        <div className="row col-md-4">
          
        </div>

      </div>
    );
  }
});