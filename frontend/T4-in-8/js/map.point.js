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
     * @param {Array} data             Data object for rendering the point.
     * @constructor
     */
    var MapPoint = function (canvas,svg, projection, data,configurations) {
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
        /**
         * Default radius.
         * @type Number
         */
        this.radius = 5;
        /**
         * Default point color
         * @type String
         */
        this.color = "#ff0000";
        /**
         * Object containing the real x and y positions 
         * of the point whithin the canvas.
         * @protected
         * @type Object
         */
        this.realPosition = {};
        
        this.configurations = configurations;

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
                    .attr("r", this.radius);
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
            //ONLY THE FIRST INFO FOR THE POINT
            var data = this.data[0];
            //var pointData = data.point;
            var pointVector = this.svg.append("circle");
            
            //RADIUS -->
            //pointData.radius = this.radius || 0;
            pointVector.attr("r",this.radius);
            
            //COLOR -->
            pointVector.attr("fill",this.color);
            
            pointVector.attr("class","type-"+data.type);
            
            
            //OTHER ATTRIBS
            pointVector.on("click",function(event){
                
                me.trigger(d3.event);
            });
            
            var rand = Math.floor(Math.random() * this.configurations.pointMaximalSeparation) + this.configurations.pointMinimalSeparation ;
            
            //LOCATION -->
            var translation = me.projection([data.latitude+rand,data.longitude+rand]);
            
            pointVector.attr("transform", function() {return "translate(" + translation + ")";});
            pointVector.attr("selected",false);
            
            this.point = pointVector;
            this.realPosition = translation;
            
            this.addCard();
        },
        /**
         * Evals all the media inside the point agains the incoming category
         * @param {Array} categorySelection
         * @returns {undefined}
         */
        inject:function(categorySelection){
            if(!this.card.select(categorySelection)){
                this.hide();
            }else{
                this.show();
            }
        },
        /**
         * This method will render a single card associated with the point
         * @public
         * @memberOf MapPoint
         * @instance
         * @returns {undefined}
         */
        addCard: function () {
            var dom = Card.createCardElement(this.data,this.configurations);
            this.macroCanvas.appendChild(dom);
            
            this.card = new Card(dom,{pointPosition:this.realPosition}, this.point);
            
        },
        /**
         * Triggers the current point
         * @private
         * @returns {undefined}
         */
        trigger:function(event){
            var me = this;
            var x = event.clientX + this.radius;
            var y = event.clientY + this.radius;
            var mc = $(this.macroCanvas);
            if(x > mc.width()/2){
                x = event.clientX - this.radius - $(this.card.element).width();
            }
            if(y > mc.height()/2){
                y = event.clientY - this.radius - $(this.card.element).height();
            }
            
            this.card.moveTo(x,y);
            this.card.toggle(function(){
                this.reset();
                if(this.isHidden){
                    this.point.attr("selected","true");
                }else{
                    this.point.attr("selected","false");
                }
                
            });
            
            
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
     * @param {Array} data             Data object for rendering the point.
     * @public
     * @static
     * @returns {MapPoint}
     */
    MapPoint.make = function(canvas, svg, projection, data,conf){
        return new MapPoint(canvas, svg, projection, data,conf);
    };


    //FACTORY's FINAL OBJECT
    return MapPoint;
});

