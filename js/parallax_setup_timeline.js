
function parallaxSetup(){
// ------------------------ SETUP MOTION SLIDES-----------------------------
var totalSlides = jQuery('slide').length;
var slideAttr = [];
// ------ SETUP SLIDE 1-------
var slide1Attr = {
'0':"transform:translate(0,0vh);",
'300':"transform:translate(0,0vh);", 
'400':"transform:translate(0,-100vh);",
'700':"transform:translate(0,-100vh);",
'800':"transform:translate(0,-100vh);",
'triggerin':"200",
'triggerout':"300",
'color':"white"};
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
'triggerout':"800",
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
'1100':"transform:translate(0,-100vh);",
'1300':"transform:translate(0,-100vh);",
'1400':"transform:translate(0,-200vh);",
'triggerin':"880",
'triggerout':"1300",
'color':"white"};
slideAttr.push(slide3Attr);
// ------ SETUP SLIDE 4-------
var slide4Attr = {
'1300':"transform:translate(0,100vh);",

'1301':"transform:translate(0,0vh);",
'1400':"transform:translate(0,0vh);",
'1800':"transform:translate(0,0vh);",
'1810':"transform:translate(0,-100vh);",
'2101':"transform:translate(0,-100vh);",
'2202':"transform:translate(0,-100vh);",
'triggerin':"1400",
'triggerout':"1800",
'color':"white"};
slideAttr.push(slide4Attr);


// ------ SETUP SLIDE 5-------
var slide5Attr = {
'0':"transform:translate(0,110vh);",
'1480':"transform:translate(0,110vh);",
'1500':"transform:translate(0,100vh);",
'1700':"transform:translate(0,100vh);",
'1800':"transform:translate(0,0vh);",
'2100':"transform:translate(0,0vh);",
'2200':"transform:translate(0,-100vh);",
'triggerin':"1800",
'triggerout':"2100",
'color':"white"};
slideAttr.push(slide5Attr);


// ------ SETUP SLIDE 6-------
var slide6Attr = {
'0':"transform:translate(0,110vh);",
'1800':"transform:translate(0,110vh);",
'1820':"transform:translate(0,100vh);",
'2100':"transform:translate(0,100vh);",
'2101':"transform:translate(0,0vh);",
'2401':"transform:translate(0,0vh);",
'2501':"transform:translate(0,-100vh);",
'triggerin':"2200",
'triggerout':"2400",
'color':"black"};
slideAttr.push(slide6Attr);
// ------ SETUP SLIDE 7-------
var slide7Attr = {
'0':"transform:translate(0,100vh);",
'2200':"transform:translate(0,100vh);", 
'2220':"transform:translate(0,100vh);", 
'2400':"transform:translate(0,100vh);", 
'2500':"transform:translate(0,0vh);", 
'2700':"transform:translate(0,0vh);", 
'2800':"transform:translate(0,-100vh);",
'3400':"transform:translate(0,-100vh);",
'3500':"transform:translate(0,-200vh);",
'3600':"transform:translate(0,-200vh);",
'triggerin':"2500",
'triggerout':"2700",
'color':"white"};
slideAttr.push(slide7Attr);
// ------ SETUP SLIDE 8-------
var slide8Attr = {

'2500':"transform:translate(0,100vh);", 
'2700':"transform:translate(0,100vh);", 
'3400':"transform:translate(0,100vh);",
'3450':"transform:translate(0,0vh);",
'3650':"transform:translate(0,0vh);",
'3750':"transform:translate(0,-100vh);",
'triggerin':"3450",
'triggerout':"3650",
'color':"black"};
slideAttr.push(slide8Attr);
// ------ SETUP SLIDE 9-------
var slide9Attr = {

'3400':"transform:translate(0,100vh);", 
'3450':"transform:translate(0,100vh);", 
'3650':"transform:translate(0,100vh);",
'3750':"transform:translate(0,0vh);",
'3950':"transform:translate(0,0vh);",
'triggerin':"3750",
'triggerout':"4050",
'color':"black"};
slideAttr.push(slide9Attr);
// ------ APPLY MOTION-------
  
    jQuery.each(slideAttr, function(index, object) {
       jQuery.each(object,function(attribute, value){
      	
        jQuery('slide').eq(index).attr('data-'+attribute, value);
   		})
	});
// ------------------------ SETUP SLIDES CONTENT-----------------------------
var contentAttr = [];
var content1Attr = {
'0':"transform:translate(0,200vh);",
'200':"transform:translate(0,0vh);"};
contentAttr.push(content1Attr);
var content2Attr = {
'0':"transform:translate(0,100vh);",
'450':"transform:translate(-100%,0);",
'500':"transform:translate(0,0);",


};
contentAttr.push(content2Attr);
var content3Attr = {
'800':"transform:translate(0,100vh);",
'1000':"transform:translate(0,-100vh);"
};
contentAttr.push(content3Attr);
  var content4Attr = {
'1000':"transform:translate(-100%,0vh);",
'1100':"transform:translate(0,0vh);"
};
contentAttr.push(content4Attr);
  var content4_1Attr = {
'1300':"transform:translate(-100%,0vh);",
'1400':"transform:translate(0,0vh);"
};
contentAttr.push(content4_1Attr);
var content5Attr = {
'1320':"transform:translate(-100%,0vh);",
'1420':"transform:translate(0,0vh);"
};
contentAttr.push(content5Attr);
    jQuery.each(contentAttr, function(index, object) {
       jQuery.each(object,function(attribute, value){
        jQuery('.animate').eq(index).attr('data-'+attribute, value).attr('animatecount',index+1);
   		})
	});
	
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