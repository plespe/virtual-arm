var FDisp = function(){

  // just create a form.
  var input = document.createElement("input");
  var input2 = document.createElement("input");
  input.setAttribute("class","textForm form-control");
  input.setAttribute("placeholder","type some text...");
  input2.setAttribute("class","textForm form-control");
  input2.setAttribute("placeholder","type some text...");

  input.style = "top: 70%; color: blue; position: absolute; z-index: 10; left: 15%;";
  input2.style = "top: 70%; color: blue; position: absolute; z-index: 10; left: 65.7%;";

  // append to body
  $('.doms').prepend(input);
  $('.doms').prepend(input2);

  // Replicate to the form and display
  $('.doms').on('keyup','input',function(e){
    $('.doms').find('.textForm').val($(e.currentTarget).val());
    if(e.which == 13 && $(e.currentTarget).val().length > 0){ // on enter key
      $para = $('<p></p>');
      var text = $(e.currentTarget).val();
      $para.text('You: '+$(e.currentTarget).val());
      // $display = $('.doms').find('.textDisplay');
      $display = $('.doms').find('.chatBox');
      $display.append($para);
      if($display.find('p').length/2 > 9){
        // $('.doms').find('.textDisplay').first().find('p').first().remove();
        // $('.doms').find('.textDisplay').last().find('p').first().remove();
        $('.doms').find('.chatBox').first().find('p').first().remove();
        $('.doms').find('.chatBox').last().find('p').first().remove();
      }
      $('.doms').find('.textForm').val('');
      // Send message to server
      clientSocket.sendMessage(text);
    }
  });

};