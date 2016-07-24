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
            global.Card = factory(Hammer);

})(this, function (Hammer) {
    'use strict';

    /**
     * Class that handles the Card behaviour.
     * @param {DOMElement} ele
     * @param {Object} [opts]
     * @constructor
     */
    var Card = function (ele, opts) {
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
            //PAN CONFIGURATIONS
            this.ham.get('pan').set({threshold: 0, direction: Hammer.DIRECTION_ALL});
        },
        /**
         * Gets the current element  width size in pixel number.
         * @public
         * @returns {number}
         */
        currentWidth:function(){
            var el = this.element;
            
            return el.offsetWidth;
        },
        /**
         * Gets the current element  width size in pixel number.
         * @public
         * @returns {number}
         */
        currentHeight:function(){
            var el = this.element;
            
            return el.offsetHeight;
        },
        /**
         * Executes the transformation given by the transform object.
         * @param {Object} tm Transform object
         * @private
         * @returns {undefined}
         */
        executeTransform: function (tm) {
            var el = this.element;

            var value = [
                'translate3d(' + tm.translate.x + 'px, ' + tm.translate.y + 'px, 0)',
                'scale(' + tm.scale + ', ' + tm.scale + ')',
                'rotate3d(' + tm.rx + ',' + tm.ry + ',' + tm.rz + ',' + tm.angle + 'deg)'
            ];

            value = value.join(" ");
            el.style.webkitTransform = value;
            el.style.mozTransform = value;
            el.style.transform = value;
        },
        onPanStart:function(event){
            var el = this.element;
            el.style.opacity = 1;
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

            this.executeTransform(tm);
        },
        /**
         * Sets the final attribs according to the final pan position.
         * @private
         * @returns {undefined}
         */
        onPanEnd: function (event) {
            var el = this.element;
            //GETS THE CURRENT DIMESIONS IN ORDER TO 
            // SET THE OFFSET DISTANCE TO THE CENTER
            var w = this.currentWidth();
            var h = this.currentHeight();
            
            this.positionX += event.deltaX;// - w;
            this.positionY += event.deltaY;// - h;
            
            
            
            
            console.log(event);
        }
    };


    //FACTORY's FINAL OBJECT
    return Card;
});

