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
    
    

    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.MapPoint = factory($, document, Hammer, d3);

})(this, function ($, document, Hammer, d3) {
    'use strict';

    /**
     * Class that handles the MapPoint behaviour.
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
    var MapPoint = function (svg, projection, data) {
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
         * Instance's data to be rendered. Its an object
         * that contain the initial configurations of the MapPoint
         * @type {Object}
         * @protected
         */
        this.data = data;
        


        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    MapPoint.prototype = {
        /**
         * Inits the basic instance's configurations.
         * @private
         * @returns {undefined}
         */
        init:function(){
            var me = this;
            var data = this.data;
            var point = this.svg.append("circle");
            
            //RADIUS -->
            data.radius = data.radius || 0;
            point.attr("r",data.radius);
            
            //COLOR -->
            if(data.color){
                point.attr("fill",data.color);
            }
            
            //OTHER ATTRIBS
            point.on("click",function(){
                alert(data.title);
            });
            
            //LOCATION -->
            point.attr("transform", function() {return "translate(" + me.projection([data.longitude,data.latitude]) + ")";})
        }
    };
    
    /**
     * Returns a MapPoint instance
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
    MapPoint.make = function(svg, projection, data){
        return new MapPoint(svg, projection, data);
    };


    //FACTORY's FINAL OBJECT
    return MapPoint;
});

