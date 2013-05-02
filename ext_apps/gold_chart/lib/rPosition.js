$(document).ready(function() {
  $('body').append('<div id="Tip"></div>');

  $('#Target').mousemove(function(e) {
   
     var position = $(this).position();
     var offset = $(this).offset();
     var x = e.pageX - (offset.left);
     var y = e.pageY - (offset.top);
   
    $('#Tip')
      .show()
      .css({'left': e.pageX+16, 'top': e.pageY+16})
      .html('Position<br>Doc: '+e.pageX+','+e.pageY+'<br>Div: '+x+','+y);
    
    $('#DivPosition')
      .show()
      .html(offset.left+','+offset.top);
    
  });
  
  $('#Target').mouseout(function() {
    $('#Tip').hide();
    $('#DivPosition').hide();
  });
   
});