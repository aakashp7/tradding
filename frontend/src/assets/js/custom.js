//getting video element using jQuery
var v = $("#v");

//check if video is ready to play
   $(v).on('canplay', function(){
      $(v).mouseenter(function(){
         $(this).get(0).play();
      }).mouseleave(function(){
         $(this).get(0).pause();
      })
   });