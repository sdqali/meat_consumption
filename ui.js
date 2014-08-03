$(document).ready(function() {
  $(".controls > .btn").click(function() {
    $(this).siblings().removeClass("active");
    $(this).addClass("active");
    var item = $(".meat-type > .btn.active").data("type") + "." + $(".region > .btn.active").data("region");
    ready(undefined, item);
  });

  $("#modal-toggle").click(function(e) {
    e.preventDefault();
    $('#myModal').modal()
  });

  var item = $(".meat-type > .btn.active").data("type") + "." + $(".region > .btn.active").data("region");
  drawVis(item);
})
