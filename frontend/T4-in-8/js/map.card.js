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
    var Card = function (ele, opts, parent) {
        this.DURATION = 300;

        //CONSTANTS CLASSES FOR THE LAYERS
        this.BOTTOMLAYER = "bottom";
        this.MIDDLELAYER = "middle";
        this.TOPLAYER = "top";

        //CONSTANTS FOR SCALE LIMITS
        this.SCALE_ULIMIT = 1.5;
        this.SCALE_ILIMIT = 1;
        
        this.point = parent;
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
        /**
         * Current state of the card
         */
        this.isHidden = true;

        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    Card.prototype = {
        /**
         * Toggles the jQuery element of the card.
         * @public
         * @returns {undefined}
         */
        toggle: function (callback) {
            var me = this;
            if(this.isHidden){
                this.show(callback);
            }else{
                this.hide(callback);
            }
//            $(this.element).animate({
//                height:"toggle"
//            },this.DURATION,function(){
//                callback && callback.call(me);
//            });
            
        },
        /**
         * Shows the card
         * @public
         * @returns {undefined}
         */
        show: function (callback) {
            var me = this;
            $(this.element).animate({height:"toggle"},this.DURATION,function(){
                 callback && callback.call(me);
            });
            $(this.element).find(".card").show();
            this.isHidden = false;
        },
        /**
         * Hides and shows the proper elements within the card
         * if no elements remain, it returns a false.
         * @param {Array} categories
         * @returns {Boolean}
         * @public
         */
        select:function(categories){
            var card = $(this.element);
            var state = false;
            if((typeof categories).toLowerCase()=="string"){
                categories = [categories];
            }
            card.find(".card").each(function(){
                var c = $(this);
                var tags = c.attr("categories");
                
                for(var i = 0; i < categories.length;i++){
                    var singleCat = categories[i];
                    
                    if(tags.indexOf(singleCat)!==-1){
                        state = true;
                        c.show();
                    }else{
                        c.hide();
                    }
                }
            });
            
            return state;
        },
        /**
         * Hides the card
         * @public
         * @returns {undefined}
         */
        hide: function (callback) {
            var me = this;
            $(this.element).animate({height:"toggle"},this.DURATION,function(){
                 callback && callback.call(me);
            });
//            $(this.element).hide();
            this.isHidden = true;
        },
        /**
         * Resets the position of the card
         * @returns {undefined}
         */
        reset:function(){
            this.move(this.originalX,this.originalY);
            
        },
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
//            this.ham.on('panstart', function (evt) {
//                me.onPanStart(evt);
//            });

            this.ham.on('panmove', function (evt) {
                me.onPan(evt);
            });

            this.ham.on('panend', function (evt) {
                me.onPanEnd(evt);
                me.onHandleEndCallback && me.onHandleEndCallback.call(me);
            });
            this.ham.on('pinchmove', function (evt) {
                me.onPinch(evt);
            });
            this.ham.on('pinchend', function (evt) {
                me.onPinchEnd(evt);
                me.onHandleEndCallback && me.onHandleEndCallback.call(me);
            });


            //PAN CONFIGURATIONS
            //this.ham.get('pan').set({threshold: 0, direction: Hammer.DIRECTION_ALL});
            //PINCH CONFIGURATIONS
            this.ham.get('pinch').set({enable: true});


            //Origin point calculation
            var rect = ele.getBoundingClientRect();

            this.originX = rect.left;
            this.originY = rect.top;
            
            this.originalX = rect.left;
            this.originalY = rect.top;

            //DEFAULT LAYER BOTTOM
            this.moveLayerBottom();
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
            var el = this.element;
            el.style.left = x + "px";
            el.style.top = y + "px";
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
    Card.createCardElement = function (dataarray,conf) {
        var doc = document;
        
        var hugecontainer = $(doc.createElement("div"));
        hugecontainer.addClass("main-container");
        hugecontainer.css("display", "none");
        
        for (var i = 0; i < dataarray.length; i++) {

            var data = dataarray[i];
            //MAIN -
            var main = $(doc.createElement("div"));
           
            //main.attr("draggable", "true");
            main.addClass("card");
            main.addClass(data.size || "clarge");
            main.attr("data-type", data.type || "text");

            //CATEGORIES
            main.attr("categories", data.categories.join(","));

            var closeelement = $(doc.createElement("div"));
            closeelement.addClass("close-button");
            var closeinnner = $(doc.createElement("span"));
            closeelement.append(closeinnner);
            
            closeelement.on("click",function(){
                $(this).closest(".card").toggle(400);
            });
            
            main.append(closeelement);

            //CARD SUB
            var sub = $(doc.createElement("div"));
            sub.addClass("card-content");

            //CARD TITLE
            var title = $(doc.createElement("span"));
            title.addClass("card-title");
            title.text(data.title);

            //CARD CONTENT
            var content = Card.createCardContent(data,main,conf.mediaPath);

            //ADD
            main.append(sub);
            sub.append(title);
            sub.append(content);
            
            hugecontainer.append(main);
            //RETURNS THE DOMELEMENT INSIDE THE JQUERY
        }
        
        return hugecontainer[0];

    };

    /**
     * Creates the card content based on its type and content properties.
     * @private
     * @memberOf Card
     * @static
     * @returns {DOMElement}
     */
    Card.createCardContent = function (data,main,path) {
        var dom = null;
        var doc = document;
        
        data.source = (path||"")+data.source;

        switch (data.type) {
            case "video":
                dom = $(doc.createElement("video"));
                dom.attr("controls", "true");

                var inner = $(doc.createElement("source"));
                inner.attr("src", data.source);
                inner.attr("type", "video/mp4");

                dom.append(inner);

                break;
            case "image":
                dom = $(doc.createElement("img"));
                dom.attr("src", data.source);

                break;
            case "text":
            default:
                dom = $(doc.createElement("div"));
                $.ajax({
                    method:"get",
                    dataType:"text",
                    url:data.source,
                    success:(function(d,m){
                     return function(txt){
                         d.append(txt);
                         var len = txt.length;
                         
                         if(len >= 0 && len < 250){
                             m.addClass("content-small");
                         }else if(len >= 250 && len < 400){
                             m.addClass("content-medium");
                         }else if(len > 400){
                             m.addClass("content-large");
                         }
                     } ;  
                })(dom,main)});
                
                break;
        }

        dom.addClass("content");

        return dom;
    };


    //FACTORY's FINAL OBJECT
    return Card;
});

