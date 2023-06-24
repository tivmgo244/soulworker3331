// 소울워커

console.clear();
var $liIndicator1 = $('.top-bar .menu-box-1 > .li-indicator-1-box > .li-indicator-1 ' );

$('.top-bar .menu-box-1 > ul > li').mouseenter(function(event) {
  var $this = $(this);
  var $menuBox1 = $this.closest('.menu-box-1');
  var menuBox1Left = $menuBox1.position().left;
  var $span = $this.find('> a > span');
  var positionLeft = $span.position().left - menuBox1Left;
  var width = $span.outerWidth();
    
    $liIndicator1.css({
        width:width,
        left:positionLeft
    });
});


$('.w_1350').mouseleave(function() {
  $liIndicator1.css('left', '');
});

    


$(".hover").mouseleave(function() {
  $(this).removeClass("hover");
});