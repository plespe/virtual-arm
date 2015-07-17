var ChatDisp = function(){

  // just create a form.
  var input = document.createElement("div");
  var input2 = document.createElement("div");
  input.setAttribute("class","chatBox");
  input2.setAttribute("class","chatBox");

  input.style = "top: 0%; color: blue; position: absolute; z-index: 10; left: 15%;";
  input2.style = "top: 0%; color: blue; position: absolute; z-index: 10; left: 65.7%;";

  // append to body
  $('.doms').prepend(input);
  $('.doms').prepend(input2);

};