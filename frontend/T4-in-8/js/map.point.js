;
(function (global, factory) {
    //Check dependencies.
    //d3 -->
    if (typeof d3 === 'undefined') {
        throw "Error Module [map]:: d3 is not defined.";
    }
    //Hammer JS -->
    if (typeof Hammer === 'undefined') {
        throw "Error Module [map.point]:: Hammer.js is not defined.";
    }
    //Card -->
    if (typeof Card === 'undefined') {
        throw "Error Module [stage]:: Card is not defined.";
    }
    
    

    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.MapPoint = factory($, document, Hammer, d3, Card);

})(this, function ($, document, Hammer, d3, Card) {
    'use strict';

    /**
     * Class that handles the MapPoint behaviour.
     * @param {jQuery} canvas           Macro canvas for the cards.
     * @param {d3.Geo.Projection} projection d3 Projection object that will handle the coordiates calculation.
     * @param {object} data             Data object for rendering the point.
     * @param {number} data.latitude    Object's latitude.
     * @param {number} data.longitude   Object's longitude.
     * @param {number} data.radius      Object's radius.
     * @param {string} data.color       Object's color in hex string or rgb function (css)
     * @param {string} data.cssclass    Object's set of css classes to assign
     * @param {jQuery} data.content     Object's content as a jQuery object.
     * @param {Array}  data.categories  Object's categories array.
     * @constructor
     */
    var MapPoint = function (canvas,svg, projection, data) {
        /**
         * D3 Easing curve for transitions.
         * @constant
         */
        this.TRANSITION_EASE = d3.easeBackOut();
        /**
         * TRansition duration
         * @constant
         */
        this.TRANSITION_DURATION = 1000;
        /**
         * d3 vector svg element that represents the map
         * @type {d3.Svg}
         * @protected
         */
        this.svg = svg;
        /**
         * d3 Geo Projection object.
         * @type {d3.Geo}
         * @protected
         */
        this.projection = projection;
        /**
         * SVG Object that represents the point.
         * @type {d3}
         * @protected
         */
        this.point = null;
        /**
         * Instance's data to be rendered. Its an object
         * that contain the initial configurations of the MapPoint
         * @type {Object}
         * @protected
         */
        this.data = data;
        /**
         * Read-only object that holds the categories available as a 
         * map-like object being the key the category and the value a
         * true boolean
         * @public
         * @readonly
         * @type {Object}
         */
        this.categories = data.categories;
        /**
         * Associated card with this point.
         * @type {Card}
         * @readonly
         * @public
         */
        this.card = null;
        /**
         * Reference to the macro-canvas object where all card will physically
         * reside within the DOM.
         * @type {jQuery}
         * @private
         */
        this.macroCanvas = canvas;
        


        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    MapPoint.prototype = {
        /**
         * Shows the point
         * @public
         * @returns {undefined}
         */
        show:function(){
            
            this.point.transition()
                    /*.ease(this.TRANSITION_EASE)*/
                    .duration(this.TRANSITION_DURATION)
                    .attr("r", this.data.point.radius);
        },
        /**
         * Hides the point
         * @public
         * @returns {undefined}
         */
        hide:function(){
            //console.log("hide point");
            this.card.hide();
            this.point.transition()
                    /*.ease(this.TRANSITION_EASE)*/
                    .duration(this.TRANSITION_DURATION)
                    .attr("r", 0);
            
        },
        /**
         * Inits the basic instance's configurations.
         * @private
         * @returns {undefined}
         */
        init:function(){
            var me = this;
            var data = this.data;
            var pointData = data.point;
            var pointVector = this.svg.append("circle");
            
            //RADIUS -->
            pointData.radius = pointData.radius || 0;
            pointVector.attr("r",pointData.radius);
            
            //COLOR -->
            if(pointData.color){
                pointVector.attr("fill",pointData.color);
            }
            
            //OTHER ATTRIBS
            pointVector.on("click",function(event){
                me.trigger(d3.event);
            });
            
            //LOCATION -->
            var translation = me.projection([pointData.longitude,pointData.latitude]);
            
            pointVector.attr("transform", function() {return "translate(" + translation + ")";});
            
            this.point = pointVector;
            
            
            this.addCard();
        },
        /**
         * This method will render a single card associated with the point
         * @public
         * @memberOf MapPoint
         * @instance
         * @returns {undefined}
         */
        addCard: function () {
            var dom = Card.createCardElement(this.data);
            this.macroCanvas.appendChild(dom);
            
            this.card = new Card(dom);
            
        },
        /**
         * Triggers the current point
         * @private
         * @returns {undefined}
         */
        trigger:function(event){
            var x = event.clientX + this.data.point.radius;
            var y = event.clientY + this.data.point.radius;
            
            this.card.moveTo(x,y);
            this.card.toggle();
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

        }
    };
    
    /**
     * Returns a MapPoint instance
     * @param {jQuery} canvas           Macro canvas for the cards.
     * @param {d3.Geo.Projection} projection d3 Projection object that will handle the coordiates calculation.
     * @param {object} data             Data object for rendering the point.
     * @param {number} data.latitude    Object's latitude.
     * @param {number} data.longitude   Object's longitude.
     * @param {number} data.radius      Object's radius.
     * @param {string} data.color       Object's color in hex string or rgb function (css)
     * @param {string} data.cssclass    Object's set of css classes to assign
     * @param {jQuery} data.content     Object's content as a jQuery object.
     * @param {Array}  data.categories  Object's categories array.
     * @public
     * @static
     * @returns {MapPoint}
     */
    MapPoint.make = function(canvas, svg, projection, data){
        return new MapPoint(canvas, svg, projection, data);
    };


    //FACTORY's FINAL OBJECT
    return MapPoint;
});

