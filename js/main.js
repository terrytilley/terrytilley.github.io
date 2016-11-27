$(document).ready(function() {
  $('.cards li figure').hover(
    function(){ $(this).addClass('hover'); },
    function(){ $(this).removeClass('hover'); }
  );
});
