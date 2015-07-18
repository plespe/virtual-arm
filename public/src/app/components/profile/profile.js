var Profile = React.createClass({
  getInitialState: function(){
    if(!Auth.loggedIn()){
      location.hash = '/login';
    }
    return {
      error: false,
      loggedIn: Auth.loggedIn()
    };
  },
  render: function() {
    return (
      <div className="profile">
        <div className="col-md-3"> 
          <h3>Your Profile</h3>
          <img src=""className="img-responsive img-circle"></img>
          <p>Jason</p>
          <p>Statham</p>
          <p>I enjoy really bad movies.</p>
        </div>
        <div className="col-md-9"> 
          <h3>Threads </h3>
          <table>
            <th>
              <td>Title</td>
              <td>Rating</td>
            </th>

          </table>
        </div>
      </div>
    );
  }
});