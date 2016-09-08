
function parallaxSetup(){
// ------------------------ SETUP MOTION SLIDES-----------------------------
var totalSlides = jQuery('slide').length;
var slideAttr = [];
// ------ SETUP SLIDE 1-------
var slide1Attr = {
'200':"transform:translate(0,0vh);",
'400':"transform:translate(0,0vh);", 
'500':"transform:translate(0,-100vh);",
'700':"transform:translate(0,-100vh);",
'800':"transform:translate(0,-100vh);",
'triggerin':"200",
'triggerout':"400",
'color':"black"};
slideAttr.push(slide1Attr);
// ------ SETUP SLIDE 2-------
var slide2Attr = {
'299':"transform:translate(0,100vh);",
'300':"transform:translate(0,0vh);",
'700':"transform:translate(0,0vh);",
'800':"transform:translate(0,0vh);",
'801':"transform:translate(0,-100vh);",
'1099':"transform:translate(0,-100vh);",
'1100':"transform:translate(0,-100vh);",
'triggerin':"500",
'triggerout':"700",
'color':"black"};
slideAttr.push(slide2Attr);
// ------ SETUP SLIDE 3-------
var slide3Attr = {
'0':"transform:translate(0,100vh);",
'300':"transform:translate(0,100vh);", 
'310':"transform:translate(0,100vh);", 
'700':"transform:translate(0,100vh);", 
'800':"transform:translate(0,0vh);", 
'1000':"transform:translate(0,0vh);", 
'1100':"transform:translate(0,-110vh);",
'triggerin':"800",
'triggerout':"1000",
'color':"white"};
slideAttr.push(slide3Attr);
// ------ SETUP SLIDE 4-------
var slide4Attr = {
'1000':"transform:translate(0,100vh);",

'1001':"transform:translate(0,0vh);",
'1300':"transform:translate(0,0vh);",
'1301':"transform:translate(0,0vh);",
'1599':"transform:translate(0,0vh);",
'1600':"transform:translate(0,-110vh);",

'triggerin':"1100",
'triggerout':"1300",
'color':"white"};
slideAttr.push(slide4Attr);


// ------ SETUP SLIDE 5-------
var slide5Attr = {
'0':"transform:translate(0,110vh);",
'1300':"transform:translate(0,110vh);",
'1400':"transform:translate(0,0vh);",

'1700':"transform:translate(0,0vh);",
'1800':"transform:translate(0,-110vh);",
'triggerin':"1400",
'triggerout':"1700",
'color':"white"};
slideAttr.push(slide5Attr);


// ------ SETUP SLIDE 6-------
var slide6Attr = {
'0':"transform:translate(0,110vh);",
'1699':"transform:translate(0,110vh);",
'1700':"transform:translate(0,0vh);",
'2501':"transform:translate(0,0vh);",
'2502':"transform:translate(0,-110vh);",
'triggerin':"1800",
'triggerout':"2100",
'color':"black"};
slideAttr.push(slide6Attr);
// ------ SETUP SLIDE 7-------
var slide7Attr = {
'0':"transform:translate(0,100vh);",
'2100':"transform:translate(0,100vh);",
'2200':"transform:translate(0,0vh);", 
'2500':"transform:translate(0,0vh);", 
'2600':"transform:translate(0,-110vh);",
'3600':"transform:translate(0,-110vh);",
'triggerin':"2200",
'triggerout':"2500",
'color':"white"};
slideAttr.push(slide7Attr);
// ------ SETUP SLIDE 8-------
var slide8Attr = {
'2499':"transform:translate(0,-110vh);", 
'2500':"transform:translate(0,0vh);", 

'2900':"transform:translate(0,0vh);",
'3300':"transform:translate(0,-110vh);",
'triggerin':"2600",
'triggerout':"2900",
'color':"black"};
slideAttr.push(slide8Attr);
// ------ SETUP SLIDE 9-------
var slide9Attr = {

'2900':"transform:translate(0,110vh);", 
'3000':"transform:translate(0,0vh);", 
'3300':"transform:translate(0,0vh);",
'3400':"transform:translate(0,-110vh);",
'triggerin':"3000",
'triggerout':"3300",
'color':"white"};
slideAttr.push(slide9Attr);
// ------ SETUP SLIDE 10-------
var slide10Attr = {

'0':"transform:translate(0,110vh);", 
'3299':"transform:translate(0,110vh);", 
'3300':"transform:translate(0,0vh);", 
'3700':"transform:translate(0,0vh);",
'4000':"transform:translate(0,0vh);",
'4100':"transform:translate(0,0vh);",
'4101':"transform:translate(0,-110vh);",
'triggerin':"3400",
'triggerout':"3700",
'color':"black"};
slideAttr.push(slide10Attr);
// ------ SETUP SLIDE 11-------
var slide11Attr = {

'0':"transform:translate(0,110vh);", 
'3700':"transform:translate(0,110vh);", 
'3800':"transform:translate(0,0vh);", 

'4100':"transform:translate(0,0vh);",
'4200':"transform:translate(0,-110vh);",
'triggerin':"3800",
'triggerout':"4100",
'color':"white"};
slideAttr.push(slide11Attr);
// ------ SETUP SLIDE 12-------
var slide12Attr = {

'0':"transform:translate(0,110vh);", 
'4099':"transform:translate(0,110vh);", 
'4100':"transform:translate(0,0vh);", 

'4500':"transform:translate(0,0vh);",
'triggerin':"4200",
'triggerout':"4500",
'color':"black"};
slideAttr.push(slide12Attr);
// ------ SETUP SLIDE 13-------
var slide13Attr = {

'0':"transform:translate(0,110vh);",
'4400':"transform:translate(0,110vh);",  
'4500':"transform:translate(0,0vh);", 
'4800':"transform:translate(0,0vh);", 

'5000':"transform:translate(0,0vh);",
'triggerin':"4500",
'triggerout':"4800",
'color':"white"};
slideAttr.push(slide13Attr);
// ------ APPLY MOTION-------
  
    jQuery.each(slideAttr, function(index, object) {
       jQuery.each(object,function(attribute, value){
      	
        jQuery('slide').eq(index).attr('data-'+attribute, value);
   		})
	});
// ------------------------ SETUP SLIDES CONTENT DOMINO DELAY  -----------------------------

jQuery('slide').each( function(index) {
i = 0;
		 jQuery('.animate').each( function() {
		 inTrig = 0;
		 outTrig = 0;
		inTrig = parseInt(jQuery('slide').eq(index).attr('data-triggerin')) + (40*i) - 100;
       outTrig = parseInt(jQuery('slide').eq(index).attr('data-triggerin')) + (40*i);
 
       console.log('id'+jQuery(this).parent('slide').attr('id')+i+'-'+inTrig+'<in out>'+outTrig);
       jQuery('slide').eq(index).children('.animate').eq(i).attr('data-'+inTrig, 'transform:translate(-50vw,0vh)').attr('data-'+outTrig, 'transform:translate(0vw,0vh)').attr('animatecount',index+1);
   		i++;
		});
	});


	
// ------------------------MANUAL SETUP SLIDES CONTENT  -----------------------------
// var contentAttr = [];
// var content1Attr = {
// '0':"transform:translate(0,200vh);",
// '200':"transform:translate(0,0vh);"};
// contentAttr.push(content1Attr);
// var content2Attr = {
// '0':"transform:translate(0,100vh);",
// '420':"transform:translate(-100%,0);",
// '500':"transform:translate(0,0);",
// 
// 
// };
// contentAttr.push(content2Attr);
// var content3Attr = {
// '0':"transform:translate(0,100vh);",
// '450':"transform:translate(-100%,0);",
// '550':"transform:translate(0,0);",
// };
// contentAttr.push(content3Attr);
//   var content4Attr = {
// '750':"transform:translate(-100%,0vh);",
// '850':"transform:translate(0,0vh);"
// };
// contentAttr.push(content4Attr);
//   var content4_1Attr = {
// '1050':"transform:translate(-100%,0vh);",
// '1150':"transform:translate(0,0vh);"
// };
// contentAttr.push(content4_1Attr);
// var content5Attr = {
// '1450':"transform:translate(-100%,0vh);",
// '1550':"transform:translate(0,0vh);"
// };
// contentAttr.push(content5Attr);
//     jQuery.each(contentAttr, function(index, object) {
//        jQuery.each(object,function(attribute, value){
//         jQuery('.animate').eq(index).attr('data-'+attribute, value).attr('animatecount',index+1);
//    		})
// 	});
// 	
// ------------------------ SETUP SLIDES BACKGROUND-----------------------------
var backAttr = [];

var back1Attr = {
'0':"transform:translate(0,0vh);",
'200':"transform:translate(0,0vh);",
'450':"transform:scale(1.2,1.2);"};
backAttr.push(back1Attr);

    jQuery.each(backAttr, function(index, object) {
       jQuery.each(object,function(attribute, value){

        jQuery('#ORIGINS_OF_WHEAT').children('.background').attr('data-'+attribute, value);
  		 })
	});
	
// ------------------------ SETUP SVG LINES-----------------------------
var svgAttr = [];

var svg1Attr = {
'3750':"stroke-dashoffset:1000;stroke-dasharray:1000,1000;",
'3900':"stroke-dashoffset:0; stroke-dasharray: 4, 7;"
};
svgAttr.push(svg1Attr);

    jQuery.each(svgAttr, function(index, object) {
       jQuery.each(object,function(attribute, value){

        jQuery('svg').find('path').attr('data-'+attribute, value);
  		 })
	});	
// ------------------------ SETUP INSTRUCTIONS-----------------------------

// -----
}