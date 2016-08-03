;
(function (global, factory) {
    

    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.CNumber = factory($);

})(this, function ($) {
    'use strict';

    /**
     * Class that handles the CNumber construction.
     * @param {Object} params CNumber parameters 
     * @param {number} width Width fixed for the main container.
     * @param {number} margin Margins
     * @constructor
     */
    var CNumber = function (params, width, margin) {
        /**
         * Element object that represents the card as a view.
         * @protected
         * @type {jQuery}
         */
        this.jqelement = null;
        /**
         * Object that holds the CNumber parameters.
         * @protected
         * @type {jQuery}
         */
        this.parameters = params;
        /**
         * Fixed with
         * @protected
         * @type {number}
         */
        this.width = width;
        /**
         * Fixed margin
         * @protected
         * @type {number}
         */
        this.margin = margin;

        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    CNumber.prototype = {
        /**
         * Gets the constructed jQuery element.
         * @public
         * @returns {jQuery}
         */
        jquery:function(){
            return this.jqelement;
        },
        /**
         * Inits the basic configurations on the object.
         * @private
         * @returns {undefined}
         */
        init: function () {
            var container = this.buildContainer();
            var body = this.buildBody();
            var head = this.buildHead();
            
            container.append(head);
            container.append(body);
            
            this.jqelement = container;
        },
        /**
         * Builds the main card number container
         * @private
         * @returns {jQuery}
         */
        buildContainer:function(){
            var el = $(document.createElement("div"));
            el.addClass("number");
            el.attr("id",this.parameters.id);
            el.css("width",this.width+"px");
            el.css("margin-left",this.margin+"px");
            el.css("margin-right",this.margin+"px");
            
            return el;
        },
        /**
         * Builds the main card number head
         * @private
         * @returns {jQuery}
         */
        buildHead:function(){
            var el = $(document.createElement("div"));
            el.addClass("number-header");
            
            
            el.append(this.createImage());
            el.append(this.createNumber());
            
            return el;
        },
        /**
         * Builds the main card number head
         * @private
         * @returns {jQuery}
         */
        createImage:function(){
            var image = this.parameters.image;
            var el = $(document.createElement("div"));
            
            el.addClass("number-image");
            el.css("height",(this.width/2)+"px");
            
            if(image){
                var img = $(document.createElement("img"));
                img.attr("src",image);
                el.append(img);
            }
            return el;
        },
        /**
         * Creates the jquery element for the body
         * @private
         * @returns {jQuery}
         */
        buildBody: function(){
            var content = this.parameters.content;
            var el = $(document.createElement("span"));
            
            el.addClass("number-content");
            el.text(content);
            
            return el;
            
        },
        /**
         * Builds the actual number based on the length and the box capacity
         * @private
         * @returns {jQuery}
         */
        createNumber:function(){
            var num = this.parameters.number;
            var el = $(document.createElement("span"));
            var len = num.toString().length;
            var fontsize = (this.width/((len == 1) ? len*2: len));
            
            
            el.addClass("number-digits");
            el.css("font-size",fontsize+"px");
            el.css("height",(this.width/2)+"px");
            el.text(this.format(num));
            
            return el;
        },
        /**
         * Builds the actual number based on the length and the box capacity
         * @param {number} num number to format
         * @private
         * @returns {string}
         */
        format:function(num){
             return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    };


    //FACTORY's FINAL OBJECT
    return CNumber;
});

