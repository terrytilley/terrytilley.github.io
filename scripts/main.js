$(document).ready(function() {
  $('.cards li figure').hover(
    function(){ $(this).addClass('hover'); },
    function(){ $(this).removeClass('hover'); }
  );
});

// $(document).ready(function() {
//   $('.cards li figure').click(function() {
//     $(this).toggleClass('hover');
//   });
// });
