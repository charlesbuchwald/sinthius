  console.log('js loaded');
  var triggers = [];

// ------------------------ SETUP Standby-----------------------------
  function standBy(){
   

    // idleTimer() takes an optional object argument that defines any/all setting
    $( document ).idleTimer( {
        timeout:10000, 
        idle:true,
        events:'touchstart'
    });

   $( document ).on( "idle.idleTimer", function(event, elem, obj){
       stopStandBy();
    });

    $( document ).on( "active.idleTimer", function(event, elem, obj, triggerevent){
       startStandBy();
    });


}
 function startStandBy(){
 
 $('standby').css('display','block');

 $('standby').css('opacity',1);
 console.log('standby On');
 }
 function stopStandBy(){
 
 $('standby').css('opacity',0);
  setTimeout(function () {
    $('standby').css('display','none');
}, 500);
  console.log('standby Off');
 }
 


   $(document).ready(function(){

	 $('slide').click(function(e){
	 $('popper text').removeClass('show');
	   $('popper text').eq($(this).index()).addClass('show');
	   $('popper').addClass('show').fadeIn();
	 
	 })
	  $('popper.show').click(function(e){
	
	 	$('popper text').removeClass('show');
	  
	   $('popper').removeClass('show').fadeOut();
	 
	 })

	});
	// ------------------------ on load-----------------------------

  $(window).load(function(){
	
			
		$('body').css('opacity','1');
	});