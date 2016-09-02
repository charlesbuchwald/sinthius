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
            global.Canvas = factory($,document,Hammer);

})(this, function ($, document,Hammer) {
    'use strict';

    /**
     * Class that handles the Canvas behaviour.
     * @param {Array} [data] Optional data object. Data can also be set on Canvas#render method.
     * @constructor
     */
    var Canvas = function (data) {
        //CONSTANTS FOR SCALE LIMITS
        this.SCALE_ULIMIT = 1.5;
        this.SCALE_ILIMIT = 0.5;
        /**
         * Local instance reference of the global configurations
         * @type {Canvas.Configurations}
         * @public
         * @memberOf Canvas
         */
        this.Configurations = Canvas.Configurations;
        /**
         * DOMElement that will hold the image canvas upon rendering.
         * @type {DOMElement}
         * @protected
         */
        this.element = null;
        /**
         * Instance's data to be rendered. Array of points in the path
         * @type {Array}
         * @protected
         */
        this.data = data;
        /**
         * SVG To be set inside de canvas.
         * @type {SVG}
         * @protected
         */
        this.vector = null;
        /**
         * Instance's defined width taken from the element.
         * @type {number}
         * @protected
         */
        this.width = null;
        /**
         * Instance's defined height taken from the element.
         * @type {number}
         * @protected
         */
        this.height = null;
        /**
         * Last scale of the canvas
         * @type {number}
         * @protected
         */
        this.lastScale = 1;
        /**
         * Current and initial scale of the canvas
         * @type {number}
         * @protected
         */
        this.currentScale = 1;
        /**
         * Current origin X.
         * @type {number}
         * @protected
         */
        this.originX = 0;
        /**
         * Current origin /.
         * @type {number}
         * @protected
         */
        this.originY = 0;
        /**
         * Last position X.
         * @type {number}
         * @protected
         */
        this.lastX = 0;
        /**
         * Last position Y.
         * @type {number}
         * @protected
         */
        this.lastY = 0;
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

    };

    //PROTO
    Canvas.prototype = {
        /**
         * Renders the map data with the given configurations.
         * @public
         * @param {SVG} vector Vector svg to set.
         * @param {Array} data Array set of path points.
         * @returns {undefined}
         */
        render: function (vector,data) {
            //Origin point calculation
            var rect = this.element.getBoundingClientRect();

            this.originX = rect.left;
            this.originY = rect.top;
            
            this.positionX = rect.left;
            this.positionY = rect.top;
            
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
        },
        /**
         * Inits the events
         * @returns {undefined}
         */
        init:function(){
            this.element = document.getElementById(this.Configurations.stage);
            
            //Hammer implement
            var me = this;
            var ele = this.element;
            this.ham = new Hammer(ele);

            //Hammer events
            this.ham.on('panstart', function (evt) {
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
            this.ham.get('pinch').set({enable: true});


            

        },
        /**
         * Executes the transform by position on x and y.
         * @memberof Card
         * @param {number} x Desired position on X without offset
         * @param {number} y Desired position on Y without offset
         * @return {boolean}
         */
        moveTo: function (x, y) {

            var deltaX = this.currentOriginX() - x;
            var deltaY = this.currentOriginY() - y;

            this.move(deltaX, deltaY);

            this.positionX = this.lastX;// - w;
            this.positionY = this.lastY;// - h;
        },
        /**
         * Gets the current calculated origin point in X (including offsets)
         * @memberof Canvas
         * @public
         * @returns {number}
         */
        currentOriginX: function () {
            var el = this.element;

            return this.originX - ((this.currentWidth() - el.offsetWidth) / 2);
        },
        /**
         * Gets the current calculated origin point in Y (including offsets)
         * @memberof Canvas
         * @public
         * @returns {number}
         */
        currentOriginY: function () {
            var el = this.element;

            return this.originY - ((this.currentHeight() - el.offsetHeight) / 2);
        },
        /**
         * Gets the current element  width size in pixel number.
         * @memberof Card
         * @public
         * @returns {number}
         */
        currentWidth: function () {
            var el = this.element;

            return el.offsetWidth * this.currentScale;
        },
        /**
         * Gets the current element  width size in pixel number.
         * @memberof Card
         * @public
         * @returns {number}
         */
        currentHeight: function () {
            var el = this.element;

            return el.offsetHeight * this.currentScale;
        },
        /**
         * Executes the transformation given by the transform object.
         * @memberof Card
         * @param {Object} tm Transform object
         * @private
         * @returns {undefined}
         */
        executeTransform: function (tm) {
            var el = this.element;
            tm = this.validateTransformation(tm);
            if (tm) {
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
         * @private
         * @memberof Card
         * @param {Object} 
         * @returns {boolean}
         */
        validateTransformation: function (tm) {
            var orx = this.currentOriginX();
            var ory = this.currentOriginY();
            var realTranslateX = orx + tm.translate.x;
            var realTranslateY = ory + tm.translate.y;
            var cw = this.currentWidth();
            var ch = this.currentHeight();
            var canvasWidth = this.getCanvasWidth();
            var canvasHeight = this.getCanvasHeight();
            
            //BOUNDRIES LIMIT
            //x axis limited to half (plus the center offset) the current size of the card -->
            if (realTranslateX  > 0) {
                //console.log("is larger than canvas", realTranslateX,this.currentWidth(),realTranslateX + this.currentWidth());
                tm.translate.x = 0;
                //return false;
            }
            if (realTranslateX < ((cw - canvasWidth)*-1)) {
                tm.translate.x = ((cw - canvasWidth)*-1);
                //return false;
            }
            //y axis limited to half (plus the center offset) the current size of the card -->
            if (realTranslateY > 0) {
                //console.log("current height",this.currentHeight());
                //console.log("canvas height",this.getCanvasHeight())
                tm.translate.y = 0;
                //return false;
            }
            if (realTranslateY < ((ch-canvasHeight)*-1)) {
                tm.translate.y = ((ch-canvasHeight)*-1);
                //return false;
            }

            //SCALE LIMIT
            if (tm.scale < this.SCALE_ILIMIT) {
                tm.scale = this.SCALE_ILIMIT;
            }
            if (tm.scale > this.SCALE_ULIMIT) {
                tm.scale = this.SCALE_ULIMIT;
            }

            return tm;
        },
        /**
         * Gets the current canvas width in pixel numbers
         * @memberof Card
         * @private
         * @returns {number}
         */
        getCanvasWidth: function () {
            return this.element.parentNode.offsetWidth;
        },
        /**
         * Gets the current canvas height in pixel numbers
         * @memberof Card
         * @private
         * @returns {number}
         */
        getCanvasHeight: function () {
            return this.element.parentNode.offsetHeight;
        },
        /**
         * Actions to be executed on pan start
         * @memberof Card
         * @param {HammerEvent} event
         * @private
         */
        onPanStart: function (event) {

        },
        /**
         * Executes the instructions to move the view according to the
         * pan gesture.
         * @memberof Card
         * @private
         * @returns {undefined}
         */
        onPan: function (event) {
            var x = this.positionX + event.deltaX;
            var y = this.positionY + event.deltaY;
            
            

            this.move(x, y);
        },
        /**
         * Executes the instructions to scale the view according to the
         * pinch gesture.
         * @memberof Card
         * @param {pinch} event Pinch event
         * @private
         * @returns {undefined}
         */
        onPinch: function (event) {
            var tm = this.globalTransformations;
            tm.scale = this.currentScale * event.scale;
            //console.log(tm.scale);
            tm = this.executeTransform(tm);

            this.lastScale = tm.scale;
        },
        /**
         * Sets the final attribs according to the final pan position.
         * @memberof Card
         * @private
         * @returns {undefined}
         */
        onPanEnd: function (event) {
            this.positionX = this.lastX;// - w;
            this.positionY = this.lastY;// - h;
        },
        /**
         * Sets the final attribs according to the final pan position.
         * @memberof Card
         * @private
         * @returns {undefined}
         */
        onPinchEnd: function (event) {
            this.currentScale = this.lastScale;// - w;
        },
        /**
         * Moves the card along the x and y axis by a deltaX and deltaY
         * @memberof Card
         * @param {number} x Amount of pixels to move on x
         * @param {number} y Amount of pixels to move on y
         * @public
         * @returns {undefined}
         */
        move: function (x, y) {
            var tm = this.globalTransformations;
            tm.translate.x = x;
            tm.translate.y = y;

            tm = this.executeTransform(tm);

            this.lastX = tm.translate.x;
            this.lastY = tm.translate.y;
        }
        
    };
    /**
     * Global configurations
     * @public
     * @static
     * @memberOf Canvas
     */
    Canvas.Configurations = {
        /**
         * Stage id value
         * @type {string}
         */
        stage: "stage",
        /**
         * Categories Menu jQuery selector
         * @type {string}
         */
        menuSelector: "[data-menu='categories']"
    };


    //FACTORY's FINAL OBJECT
    return Canvas;
});


//GLOBAL INITIALIZATION OF THE WORLD MAP TABLE
// DO NOT CHANGE -->
(function (global) {
    /** @type {Canvas} */
    global.SeedCanvas = new Canvas();
})(this);
// <-----