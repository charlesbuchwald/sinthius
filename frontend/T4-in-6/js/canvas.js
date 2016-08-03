;
(function (global, factory) {
    //Check dependencies.
    //Card -->
    if (typeof CNumber === 'undefined') {
        throw "Error Module [stage]:: CNumber is not defined.";
    }
    //Hammer.js v2.0 -->
    if (typeof Hammer === 'undefined') {
        throw "Error Module [card]:: Hammer is not defined.";
    }


    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.Canvas = factory($, document, CNumber, Hammer);

})(this, function ($, document, CNumber, Hammer) {
    'use strict';

    /**
     * Class that handles the Canvas behaviour.
     * @param {DOMElement} ele DOM Element that will act as canvas
     * @constructor
     */
    var Canvas = function (ele, data) {
        //CONSTANTS --->
        this.WIDTH = 200;
        this.MARGIN = 5;

        /**
         * DOM Element for the canvas.
         * @type {DOMElement}
         */
        this.element = ele;

        /**
         * Card Array
         * @type {Array.<CNumbers>}
         * @protected
         */
        this.numbers = data;
        /**
         * jQuery object from the DOMElement
         * @type {jQuery}
         * @protected
         */
        this.jQueryElement = $(this.element);
        /**
         * Parent jQuery object from the DOMElement
         * @type {jQuery}
         * @protected
         */
        this.numbersRow = this.jQueryElement.parent();
        /**
         * Pixel location of the scroll.
         * @type {number}
         * @private
         */
        this.scrollLocation = 0;


        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    Canvas.prototype = {
        /**
         * Inits the basic configurations on the object.
         * @private
         * @returns {undefined}
         */
        init: function () {
            var n = this.numbers;
            var me = this;
            
            for (var i in n) {
                var num = new CNumber(n[i], this.WIDTH, this.MARGIN);
                this.jQueryElement.append(num.jquery());
            }
            this.jQueryElement.css("width", (n.length * (this.WIDTH + (this.MARGIN * 2))) + "px");

            //Endless scroll
            this.jQueryElement.endless({
                direction: 'horizontal',
                scrollbar: 'disable'
            });
            
            //HAMMER EVENTS - PAN
            this.ham = new Hammer(this.element.parentNode);
            //Hammer events
            this.ham.on('panstart', function(evt){
                me.scrollLocation = me.numbersRow.scrollLeft();
            });
            this.ham.on('panmove', function(evt){
                var distance = me.scrollLocation - evt.deltaX;
                
                me.numbersRow.scrollLeft(distance);
                //e.preventDefault();
            });
            
            
            //PAN CONFIGURATIONS
            this.ham.get('pan').set({threshold: 0, direction: Hammer.DIRECTION_HORIZONTAL});
           
            

        }
    };


    //FACTORY's FINAL OBJECT
    return Canvas;
});


//PROVISONAL TOP HANDLERS
new Canvas(document.getElementById("numbers_content"), [
    {id: "n1", number: 20, content: "Lorem ipsun"},
    {id: "n2", number: 12000, content: "Dorloa aoih iauhdiuha iduhi hida usdi uasdivguvu gsbnfihsbgus dbf"},
    {id: "n3", number: 431, content: "asiu in ijn iniu asdiuhi asisu diaus ndiuasbdi udh i sdyab h9h iuehgiru bgihbdhsdb sudhfb sduhfb sudhbfsud hfbsu yfbusdyfbsu fbsu fbs"},
    {id: "n4", number: 32, content: "Dorloa aoih iauhdiuha iduhi hida usdi uasdivguvu gsbnfihsbgus dbf"},
    {id: "n5", number: 5, content: "ami ijasod aosid ubi i iusd iausnd asibd"},
    {id: "n6", number: 19223213, content: "a aosid ubi i iusd iausnd asibd"},
    {id: "n7", number: 931, content: "a aosid ubi i iusd iausnd asd ias dos iasudn aiudn iasu ndiuas dnsi dnasidu nsaid sanidu ansid asndia sdniausd "},
]);