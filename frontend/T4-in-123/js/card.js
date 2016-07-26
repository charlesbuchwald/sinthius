;
(function (global, factory) {
    //Check dependencies.
    //Hammer.js v2.0 -->
    if (typeof Hammer === 'undefined') {
        throw "Error Module [card]:: Hammer is not defined.";
    }

    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.Card = factory($, Hammer);

})(this, function ($, Hammer) {
    'use strict';

    /**
     * Class that handles the Card behaviour.
     * @param {DOMElement} ele
     * @param {Object} [opts]
     * @constructor
     */
    var Card = function (ele, opts) {
        //CONSTANTS CLASSES FOR THE LAYERS
        this.BOTTOMLAYER = "bottom";
        this.MIDDLELAYER = "middle";
        this.TOPLAYER = "top";
        
        //CONSTANTS FOR SCALE LIMITS
        this.SCALE_ULIMIT = 1.5;
        this.SCALE_ILIMIT = 1;
        
        /**
         * Main and raw element considered to be a card.
         * @public
         * @readonly
         * @type {DOMElement}
         */
        this.element = ele;
        /**
         * Hammer object built with the raw element.
         * @public
         * @readonly
         * @type {Hammer}
         */
        this.ham = null;
        /**
         * Read-only object that holds the categories available as a 
         * map-like object being the key the category and the value a
         * true boolean
         * @public
         * @readonly
         * @type {Object}
         */
        this.categories = {};
        /**
         * Options for the card instance
         * @protected
         * @type {Object}
         */
        this.options = opts;
        /**
         * Current object's position on X.
         * @protected
         * @type {number}
         */
        this.positionX = 0;
        /**
         * Current object's position on Y.
         * @protected
         * @type {number}
         */
        this.positionY = 0;
        /**
         * Element's origin point on X.
         * @protected
         * @type {Number}
         */
        this.originX = 0;
        /**
         * Element's origin point on Y.
         * @protected
         * @type {Number}
         */
        this.originY = 0;
        /**
         * Last successful value set to the x transformation
         * @protected
         * @type {number}
         */
        this.lastX = 0;
        /**
         * Last successful value set to the y transformation
         * @protected
         * @type {number}
         */
        this.lastY = 0;
        /**
         * Current scale on the element
         * @protected
         * @type {number}
         */
        this.currentScale = 1;
        /**
         * Last scaled value
         * @protected
         * @type {number}
         */
        this.lastScale = 1;
        /**
         * Transformation object to be used as style transformator
         * @protected
         * @type {Object}
         */
        this.globalTransformations = {
            translate: {x: 0, y: 0},
            scale: 1,
            angle: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };
        /**
         * Stores the provious layer state
         * @protected
         * @type {string}
         */
        this.previousLayerLevel = null;

        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    Card.prototype = {
        
        /**
         * Inits the basic configurations on the object.
         * @private
         * @returns {undefined}
         */
        init: function () {

            var me = this;

            //Hammer implement
            var ele = this.element;
            this.ham = new Hammer(ele);

            //Hammer events
            this.ham.on('panstart', function(evt){
                me.onPanStart(evt);
            });
            
            this.ham.on('panmove', function (evt) {
                me.onPan(evt);
            });
            
            this.ham.on('panend', function (evt) {
                me.onPanEnd(evt);
            });
            this.ham.on('pinchmove', function (evt) {
                me.onPinch(evt);
            });
            this.ham.on('pinchend', function (evt) {
                me.onPinchEnd(evt);
            });
            
            
            //PAN CONFIGURATIONS
            this.ham.get('pan').set({threshold: 0, direction: Hammer.DIRECTION_ALL});
            //PINCH CONFIGURATIONS
            this.ham.get('pinch').set({ enable: true }); 
            
            
            //Origin point calculation
            var rect = ele.getBoundingClientRect();
            
            this.originX = rect.left;
            this.originY = rect.top;
            
            
            //Extract categories
            this.categories = this.extractCategories();
            
            //DEFAULT LAYER BOTTOM
            this.moveLayerBottom();
        },
        /**
         * Moves the card to the top virtual layer
         * @public
         * @returns {undefined}
         */
        moveLayerTop:function(){
            var jelement = $(this.element);
            var l = this.TOPLAYER;
            
            this.previousLayerLevel = jelement.attr("layer");
            jelement.attr("layer",l);
            this.currentLayerLevel = l;
        },
        /**
         * Moves the card to the bottom virtual layer
         * @public
         * @returns {undefined}
         */
        moveLayerBottom:function(){
            var l = this.BOTTOMLAYER;
            var jelement = $(this.element);
            
            this.previousLayerLevel = jelement.attr("layer");
            jelement.attr("layer",l);
            this.currentLayerLevel = l;
        },
        /**
         * Moves the card to the middle virtual layer
         * @public
         * @returns {undefined}
         */
        moveLayerMiddle:function(){
            var jelement = $(this.element);
            var l = this.MIDDLELAYER;
            
            this.previousLayerLevel = jelement.attr("layer");
            jelement.attr("layer",l);
            this.currentLayerLevel = l;
            
        },
        /**
         * Moves the card to the last set virtual layer
         * @public
         * @returns {undefined}
         */
        moveLayerBack:function(){
            var jelement = $(this.element);
            var l = this.previousLayerLevel;
            if(l){
                jelement.attr("layer",l);
                this.currentLayerLevel = l;
            }
        },
        /**
         * Given the category the method will return a boolean if the card matches the category
         * @param {string} category Category to query
         * @returns {boolean}
         * @public
         */
        hasCategory:function(category){
            if(this.categories[category]){
                return true;
            }
            return false;
        },
        /**
         * Gets the current element  width size in pixel number.
         * @public
         * @returns {number}
         */
        currentWidth:function(){
            var el = this.element;
            
            return el.offsetWidth * this.currentScale;
        },
        /**
         * Gets the current element  width size in pixel number.
         * @public
         * @returns {number}
         */
        currentHeight:function(){
            var el = this.element;
            
            return el.offsetHeight * this.currentScale;
        },
        /**
         * Gets the element's parsed attribute "categories" for refering to the card's
         * categories.
         * @private
         * @returns {Object}
         */
        extractCategories: function(){
            var raw = this.element.getAttribute("categories"),
            arrayed = raw.split(","),
            len = arrayed.length,
            cats = {};
            
            for(var i = 0; i < len; i++){
                cats[arrayed[i]] = true;
            }
            
            return cats;
        },
        /**
         * Executes the transformation given by the transform object.
         * @param {Object} tm Transform object
         * @private
         * @returns {undefined}
         */
        executeTransform: function (tm) {
            var el = this.element;
            tm = this.validateTransformation(tm);
            if(tm){
                var value = [
                    'translate3d(' + tm.translate.x + 'px, ' + tm.translate.y + 'px, 0)',
                    'scale(' + tm.scale + ', ' + tm.scale + ')',
                    'rotate3d(' + tm.rx + ',' + tm.ry + ',' + tm.rz + ',' + tm.angle + 'deg)'
                ];

                value = value.join(" ");
                el.style.webkitTransform = value;
                el.style.mozTransform = value;
                el.style.transform = value;
               
            }
            return tm;
        },
        /**
         * Executes a validation of the transformation object.
         * Usefull to set limits on boundries,sizes,etc.
         * @param {Object} 
         * @returns {boolean}
         */
        validateTransformation:function(tm){
            var realTranslateX = this.originX + tm.translate.x;
            var realTranslateY = this.originY + tm.translate.y;
            
            //BOUNDRIES LIMIT
            //x axis limited to half (plus the center offset) the current size of the card -->
            if(realTranslateX + this.currentWidth() > this.getCanvasWidth()){
                //console.log("is larger than canvas", realTranslateX,this.currentWidth(),realTranslateX + this.currentWidth());
                tm.translate.x = this.getCanvasWidth()-this.originX-this.currentWidth();
                //return false;
            }
            if(realTranslateX < 0){
                tm.translate.x = 0-this.originX;
                //return false;
            }
            //y axis limited to half (plus the center offset) the current size of the card -->
            if(realTranslateY + this.currentHeight() > this.getCanvasHeight()){
                //console.log("current height",this.currentHeight());
                //console.log("canvas height",this.getCanvasHeight())
                tm.translate.y = this.getCanvasHeight()-this.originY-this.currentHeight();
                //return false;
            }
            if(realTranslateY < 0){
                tm.translate.y = 0-this.originY;
                //return false;
            }
            
            //SCALE LIMIT
            if(tm.scale < this.SCALE_ILIMIT){
                tm.scale = this.SCALE_ILIMIT;
            }
            if(tm.scale > this.SCALE_ULIMIT){
                tm.scale = this.SCALE_ULIMIT;
            }
            
            return tm;
        },
        /**
         * Gets the current canvas width in pixel numbers
         * @private
         * @returns {number}
         */
        getCanvasWidth:function(){
            return this.element.parentNode.offsetWidth;
        },
        /**
         * Gets the current canvas height in pixel numbers
         * @private
         * @returns {number}
         */
        getCanvasHeight:function(){
            return this.element.parentNode.offsetHeight;
        },
        /**
         * Actions to be executed on pan start
         * @param {HammerEvent} event
         * @private
         */
        onPanStart:function(event){
            
        },
        /**
         * Executes the instructions to move the view according to the
         * pan gesture.
         * @private
         * @returns {undefined}
         */
        onPan: function (event) {
            
            
            var x = this.positionX + event.deltaX;
            var y = this.positionY + event.deltaY;

            var tm = this.globalTransformations;
            tm.translate.x = x;
            tm.translate.y = y;

            tm = this.executeTransform(tm);
            
            this.lastX = tm.translate.x;
            this.lastY = tm.translate.y;
            
        },
        /**
         * Executes the instructions to scale the view according to the
         * pinch gesture.
         * @param {pinch} event Pinch event
         * @private
         * @returns {undefined}
         */
        onPinch:function(event){
            var tm = this.globalTransformations;
            tm.scale = this.currentScale * event.scale;
            console.log(tm.scale);
            tm = this.executeTransform(tm);
            
            this.lastScale = tm.scale;
        },
        /**
         * Sets the final attribs according to the final pan position.
         * @private
         * @returns {undefined}
         */
        onPanEnd: function (event) {
            this.positionX = this.lastX;// - w;
            this.positionY = this.lastY;// - h;
        },
        /**
         * Sets the final attribs according to the final pan position.
         * @private
         * @returns {undefined}
         */
        onPinchEnd: function (event) {
            this.currentScale = this.lastScale;// - w;
        }
    };


    //FACTORY's FINAL OBJECT
    return Card;
});

