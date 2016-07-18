$(window).load(function(){
$('body').css('opacity','1');
console.log('loaded');
})
$(window).bind('scroll', function() {
pos = $(this).scrollLeft();
 console.log();
 
 if(pos > 0 && pos < 1920){

 posLeft = (pos/1920)*100;
  // valueLeft = (20 + posLeft*80)*-1;
  console.log('slide1 |'+ posLeft);
  $('.slide1 .text > animate').each(function(i){
  $(this).css('left', ((100-posLeft)+(10*i))+'vw')
  })
 }
if($(this).scrollLeft() + $(this).innerWidth() >= $(this)[0].scrollWidth) {
console.log('at bottom');

    } else {

    }
}); 
// $('horicont').scroll(function(){
// console.log($(this).scrollLeft());
// if($(this).scrollLeft() + $(this).innerWidth() >= $(this)[0].scrollWidth) {
// console.log('at bottom');
// 
//     } else {
// console.log('notbottom');
//     }
// })