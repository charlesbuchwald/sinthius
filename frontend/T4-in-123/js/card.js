/** @class Card */
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
         * Card Type
         * @public
         * @readonly
         * @type {string}
         */
        this.type = "text";
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
         * Function to be called when the card is being handled.
         * @protected
         * @type {function}
         */
        this.onHandleCallback = null;
        /**
         * Function to be called when the card is finished being handled.
         * @protected
         * @type {function} 
         */
        this.onHandleEndCallback = null;
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
         * @memberof Card
         * @returns {undefined}
         */
        init: function () {

            var me = this;

            //Hammer implement
            var ele = this.element;
            this.ham = new Hammer(ele);

            //Hammer events
            this.ham.on('panstart', function (evt) {
                me.onPanStart(evt);
                me.onHandleCallback && me.onHandleCallback.call(me);
            });

            this.ham.on('panmove', function (evt) {
                me.onPan(evt);
            });

            this.ham.on('panend', function (evt) {
                me.onPanEnd(evt);
                me.onHandleEndCallback && me.onHandleEndCallback.call(me);
            });
            this.ham.on('pinchmove', function (evt) {
                me.onPinch(evt);
                me.onHandleCallback && me.onHandleCallback.call(me);
            });
            this.ham.on('pinchend', function (evt) {
                me.onPinchEnd(evt);
                me.onHandleEndCallback && me.onHandleEndCallback.call(me);
            });


            //PAN CONFIGURATIONS
            this.ham.get('pan').set({threshold: 0, direction: Hammer.DIRECTION_ALL});
            //PINCH CONFIGURATIONS
            this.ham.get('pinch').set({enable: true});


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
         * Function to be called when any card is being handled
         * @returns {undefined}
         */
        onHandle: function(callback){
            this.onHandleCallback = callback;
        },
        /**
         * Sets a callback to be called when the card is being handled by a touch event.
         * @param {function} callback Function to be set as callback.
         * @public
         * @memberof Card
         * @returns {undefined}
         */
        onHandleEnd: function (callback) {
            this.onHandleEndCallback = callback;
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
         * If the current card's layer is TOP layer.
         * @memberof Card
         * @public
         * @returns {Boolean}
         */
        isTop: function () {
            return this.currentLayerLevel == this.TOPLAYER;
        },
        /**
         * If the current card's layer is TOP layer.
         * @memberof Card
         * @public
         * @returns {Boolean}
         */
        isMiddle: function () {
            return this.currentLayerLevel == this.MIDDLELAYER;
        },
        /**
         * If the current card's layer is TOP layer.
         * @memberof Card
         * @public
         * @returns {Boolean}
         */
        isBottom: function () {
            return this.currentLayerLevel == this.BOTTOMLAYER;
        },
        /**
         * Moves the card to the top virtual layer
         * @memberof Card
         * @public
         * @returns {undefined}
         */
        moveLayerTop: function () {
            var jelement = $(this.element);
            var l = this.TOPLAYER;

            this.previousLayerLevel = jelement.attr("layer");
            jelement.attr("layer", l);
            this.currentLayerLevel = l;
        },
        /**
         * Moves the card to the bottom virtual layer
         * @memberof Card
         * @public
         * @returns {undefined}
         */
        moveLayerBottom: function () {
            var l = this.BOTTOMLAYER;
            var jelement = $(this.element);

            this.previousLayerLevel = jelement.attr("layer");
            jelement.attr("layer", l);
            this.currentLayerLevel = l;
        },
        /**
         * Moves the card to the middle virtual layer
         * @memberof Card
         * @public
         * @returns {undefined}
         */
        moveLayerMiddle: function () {
            var jelement = $(this.element);
            var l = this.MIDDLELAYER;

            this.previousLayerLevel = jelement.attr("layer");
            jelement.attr("layer", l);
            this.currentLayerLevel = l;

        },
        /**
         * Moves the card to the last set virtual layer
         * @memberof Card
         * @public
         * @returns {undefined}
         */
        moveLayerBack: function () {
            var jelement = $(this.element);
            var l = this.previousLayerLevel;
            if (l) {
                jelement.attr("layer", l);
                this.currentLayerLevel = l;
            }
        },
        /**
         * Given the category the method will return a boolean if the card matches the category
         * @memberof Card
         * @param {string|Array} category Category or Categories to query
         * @returns {boolean}
         * @public
         */
        hasCategory: function (category) {
            
            if ((typeof category).toLowerCase() == "string") {
                var evaled = this.evalCategory(category);
                if (evaled) {
                    return true;
                }

            } else {
                for (var i = 0; i < category.length; i++) {
                    var cat = category[i];
                    var evaled = this.evalCategory(cat);
                    if (evaled) {
                        return true;
                    }

                }

            }
            return false;

        },
        /**
         * Evals if this Card matched the given category
         * @param {string} cat Category
         * @private
         * @returns {boolean}
         */
        evalCategory: function (cat) {
            var cats = this.categories;
            //MIXED CONDITION ->
            if (cat.indexOf("&") !== -1) {
                var allconds = cat.split("&");
                
                for(var i = 0; i < allconds.length; i++){
                    if(!cats[allconds[i]]){
                        return false;
                    }
                }
                return true;
                
            } else {
                if (cats[cat]) {
                    return true;
                }
            }
            return false;

        },
        /**
         * Gets the current calculated origin point in X (including offsets)
         * @memberof Card
         * @public
         * @returns {number}
         */
        currentOriginX: function () {
            var el = this.element;

            return this.originX - ((this.currentWidth() - el.offsetWidth) / 2);
        },
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
         * Gets the element's parsed attribute "categories" for refering to the card's
         * categories.
         * @memberof Card
         * @private
         * @returns {Object}
         */
        extractCategories: function () {
            var raw = this.element.getAttribute("categories"),
                    arrayed = raw.split(","),
                    len = arrayed.length,
                    cats = {};

            for (var i = 0; i < len; i++) {
                cats[arrayed[i]] = true;
            }

            return cats;
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

            //BOUNDRIES LIMIT
            //x axis limited to half (plus the center offset) the current size of the card -->
            if (realTranslateX + this.currentWidth() > this.getCanvasWidth()) {
                //console.log("is larger than canvas", realTranslateX,this.currentWidth(),realTranslateX + this.currentWidth());
                tm.translate.x = this.getCanvasWidth() - orx - this.currentWidth();
                //return false;
            }
            if (realTranslateX < 0) {
                tm.translate.x = 0 - orx;
                //return false;
            }
            //y axis limited to half (plus the center offset) the current size of the card -->
            if (realTranslateY + this.currentHeight() > this.getCanvasHeight()) {
                //console.log("current height",this.currentHeight());
                //console.log("canvas height",this.getCanvasHeight())
                tm.translate.y = this.getCanvasHeight() - ory - this.currentHeight();
                //return false;
            }
            if (realTranslateY < 0) {
                tm.translate.y = 0 - ory;
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
     * Creates a DOMElement object that contains all the needed properties to
     * render the card into the view. This DOMElement is not yet inited
     * as Card, it is only the blueprint.
     * @public
     * @memberOf Card
     * @static
     * @returns {DOMElement}
     */
    Card.createCardElement = function (data) {
        var doc = document;

        //MAIN -
        var main = $(doc.createElement("div"));
        main.attr("draggable", "true");
        main.addClass("card");
        main.addClass(data.size || "clarge");
        main.attr("data-type", data.type || "text");

        //CATEGORIES
        main.attr("categories", data.categories.join(","));

        //CARD SUB
        var sub = $(doc.createElement("div"));
        sub.addClass("card-content");

        //CARD TITLE
        var title = $(doc.createElement("span"));
        title.addClass("card-title");
        title.text(data.title);

        //CARD CONTENT
        var content = Card.createCardContent(data);

        //ADD
        main.append(sub);
        sub.append(title);
        sub.append(content);

        //RETURNS THE DOMELEMENT INSIDE THE JQUERY
        return main[0];

    };

    /**
     * Creates the card content based on its type and content properties.
     * @private
     * @memberOf Card
     * @static
     * @returns {DOMElement}
     */
    Card.createCardContent = function (data) {
        var dom = null;
        var doc = document;

        switch (data.type) {
            case "video":
                dom = $(doc.createElement("video"));
                dom.attr("controls","true");
                
                var inner = $(doc.createElement("source"));
                inner.attr("src",data.source);
                inner.attr("type","video/mp4");
                
                dom.append(inner);
               
                break;
            case "image":
                dom = $(doc.createElement("img"));
                dom.attr("src", data.source);
                
                break;
            case "text":
            case "custom":
            default:
                dom = $(doc.createElement("div"));
                dom.append(data.content);
                break;
        }

        dom.addClass("content");

        return dom;
    };


    //FACTORY's FINAL OBJECT
    return Card;
});

