;
(function (global, factory) {


    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.CNumber = factory($, window);

})(this, function ($, window) {
    'use strict';

    /**
     * Class that handles the CNumber construction.
     * @param {Object} params CNumber parameters 
     * @param {number} width Width fixed for the main container.
     * @param {number} margin Margins
     * @constructor
     */
    var CNumber = function (params, width, margin,i,defaultLanguage) {
        /**
         * Factor to which the speed will lower to create
         * an easing effect
         * @type {number}
         * @constant
         */
        this.EASE_DECREASE_FACTOR = 5;
        /**
         * Frames per second that the easing will last.
         * @type {number}
         * @constant
         */
        this.EASE_FPS = 30;
        /**
         * Class with the transformation ease attributes
         * for the slowing effect.
         * 
         */
        this.easeClass = "transform-numbers-ease";
        /**
         * DOMElement object that represents the card as a view.
         * @protected
         * @type {DOMElement}
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
        /**
         * Origin to the left
         * @protected
         * @type {number}
         */
        this.originLeft = 0;
        /**
         * Limit marked by the parent canvas view width.
         * @protected
         * @type {number}
         */
        this.limit = 0;
        /**
         * Interval number id that will handle easing out
         * @protected
         * @type {number}
         */
        this.easeInterval = null;
        
        this.lang = defaultLanguage;

        //CALL TO PROTO METHOD init.
        this.prepare();
    };

    //PROTO
    CNumber.prototype = {
        /**
         * Inits the Number Card by markin the initial position.
         * @public
         * @returns {undefined}
         */
        init: function (l) {
            this.originLeft = l;
            this.element.style.left = this.originLeft + "px";
            this.limit = this.element.parentNode.offsetWidth;
        },
        /**
         * Gets the current left property.
         * @public
         * @returns {Number}
         */
        getLeft:function(){
            return this.originLeft;
        },
        /**
         * Sets the language to display
         * @param {type} lang
         * @returns {undefined}
         */
        setLanguage:function(lang){
            this.lang = lang;
            this.changeLanguage();
        },
        /**
         * Cahnges the display of the language
         * @returns {undefined}
         */
        changeLanguage:function(){
            if(this.jqelement){
                this.jqelement.find(".lang-text").hide();
                this.jqelement.find("[lang='"+this.lang+"']").show();
            }
        },
        /**
         * Registers a new function that will receive updates on the left prop change.
         * @public
         * @param {function} callback
         * @returns {undefined}
         */
        listen: function (callback) {
            this.listenChange = callback;
        },
        /**
         * Registers a new function that will receive updates on the left prop change.
         * @public
         * @param {function} callback
         * @returns {undefined}
         */
        ignore: function (callback) {
            this.listenChange = null;
        },
        
        /**
         * Marks the start of the Pan event
         * @public
         * @returns {undefined}
         */
        panStart: function () {
            //this.jqelement.removeClass(this.easeClass);
            //this.stopEase();
        },
        /**
         * Marks the end of the Pan event
         * @public
         * @returns {undefined}
         */
        panEnd: function (evt) {
            //this.jqelement.addClass(this.easeClass);
            
            this.originLeft += evt.deltaX;
            //this.easeOut(evt);
        },
        /**
         * Pans the card by a Hammer Event object properties.
         * @param {HammerEvent} event
         * @public
         * @returns {undefined}
         */
        pan: function (event) {
            var dist = this.originLeft + event.deltaX;
            this.executeTransform(dist);
        },
        /**
         * Gets the constructed jQuery element.
         * @public
         * @returns {jQuery}
         */
        jquery: function () {
            return this.jqelement;
        },
        /**
         * Stops the easing interval.
         * @private
         * @returns {undefined}
         */
        stopEase:function(){
           if(this.easeInterval){
                window.clearInterval(this.easeInterval);
            } 
        },
        /**
         * Creates a smooth ease on the release of the panned element
         * using the speed as main parameter.
         * @param {HammerEvent} evt Event that was sent on "panend".
         * @returns {undefined}
         */
        easeOut:function(evt){
            var speed = evt.overallVelocityX;
            var decrese = this.EASE_DECREASE_FACTOR * Math.abs(speed);
            var fpsAsMillis = 1000/this.EASE_FPS;
            
            //console.log(evt);
            this.easeDistance = speed*1000;
            
            this.easeInterval = window.setInterval((function(me,d){
                return function(){
                    var ed = me.easeDistance / d;
                    console.log(ed);
                    if(Math.abs(ed) < 0.001){
                        me.stopEase();
                        return;
                    }
                    me.pan({deltaX:ed});
                    me.originLeft+=ed;
                    
                    me.easeDistance = ed;
                };
            })(this,decrese),fpsAsMillis);
        },
        /**
         * Builds the basic structure on the object.
         * @private
         * @returns {undefined}
         */
        prepare: function () {
            var container = this.buildContainer();
            var body = this.buildBody();
            var head = this.buildHead();

            container.append(head);
            container.append(body);

            this.jqelement = container;
            this.element = container[0];
        },
        /**
         * Builds the main card number container
         * @private
         * @returns {jQuery}
         */
        buildContainer: function () {
            var el = $(document.createElement("div"));
            el.addClass("number");
            //el.attr("id", this.parameters.id);
            el.css("width", this.width + "px");
            el.css("margin-left", this.margin + "px");
            el.css("margin-right", this.margin + "px");
            

            return el;
        },
        /**
         * Builds the main card number head
         * @private
         * @returns {jQuery}
         */
        buildHead: function () {
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
        createImage: function () {
            var image = this.parameters.image;
            var el = $(document.createElement("div"));

            el.addClass("number-image");
            el.css("height", (this.width / 2) + "px");

            if (image) {
                var img = $(document.createElement("img"));
                img.attr("src", image);
                el.append(img);
            }
            return el;
        },
        /**
         * Creates the jquery element for the body
         * @private
         * @returns {jQuery}
         */
        buildBody: function () {
            var content = this.parameters.content;
            var el = $(document.createElement("div"));
            el.addClass("number-content");
            
            console.log("thislang",this.lang);
            for(var i in content){
                var innerSpan = $(document.createElement("span"));
                innerSpan.attr("lang",i);
                innerSpan.addClass("lang-text");
                innerSpan.text(content[i]);
                if(i != this.lang){
                    innerSpan.hide();
                }
                el.append(innerSpan);
            }
            return el;

        },
        /**
         * Builds the actual number based on the length and the box capacity
         * @private
         * @returns {jQuery}
         */
        createNumber: function () {
            var num = this.parameters.number;
            var el = $(document.createElement("span"));
            var len = num.toString().length;
            var fontsize = (this.width / ((len == 1) ? len * 2 : len));
            var height = (this.width / 2);

            el.addClass("number-digits");
            el.css("font-size", fontsize + "px");
            el.css("height", height + "px");
            el.css("line-height",height + "px");
            el.text(num);

            return el;
        },
        /**
         * Executes the transformation given by the transform object.
         * @param {Object} tm Transform object
         * @private
         * @returns {undefined}
         */
        executeTransform: function (x) {
            var el = this.element;
            var lc = this.listenChange;

            if (x) {
                lc && lc.call(this,x);
                el.style.left = x + "px";

            }

        },
        /**
         * Builds the actual number based on the length and the box capacity
         * @param {number} num number to format
         * @private
         * @returns {string}
         */
        format: function (num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    };


    //FACTORY's FINAL OBJECT
    return CNumber;
});

