;
(function (global, factory) {
    //Check dependencies.
    
    //d3 -->
    if (typeof d3 === 'undefined') {
        throw "Error Module [map]:: d3 is not defined.";
    }
    //d3 -->
    if (typeof d3.geoRobinson === 'undefined') {
        throw "Error Module [map]:: d3-geo-projection is not defined.";
    }
    //topojson -->
    if (typeof topojson === 'undefined') {
        throw "Error Module [map]:: topojson is not defined.";
    }
    
    //MapPoint -->
    if (typeof MapPoint === 'undefined') {
        throw "Error Module [map]:: MapPoint is not defined.";
    }
    

    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.WorldMap = factory($, self,d3, topojson,MapPoint);

})(this, function ($, self, d3, topojson,MapPoint) {
    'use strict';

    /**
     * Class that handles the WorldMap behaviour.
     * @param {DOMElement} ele DOM Element that will act as canvas
     * @param {Array} [data] Optional data object. Data can also be set on WorldMap#render method.
     * @constructor
     */
    var WorldMap = function (ele, data) {
        /**
         * DOMElement that will hold the map canvas upon rendering.
         * the map will auto-adjust to this element's bounding limits.
         * @type {DOMElement}
         * @protected
         */
        this.element = ele;
        /**
         * Instance's data to be rendered. Its an array of objects
         * that contain the initial configurations of a MapPoint
         * @see MapPoint
         * @type {Array}
         * @protected
         */
        this.data = data;
        /**
         * d3 Geo Projection object.
         * @type {d3.Geo}
         * @protected
         */
        this.projection = null;
        /**
         * d3 vector Path that represents the map
         * @type {d3.Path}
         * @protected
         */
        this.path = null;
        /**
         * d3 vector svg element that represents the map
         * @type {d3.Svg}
         * @protected
         */
        this.mainSvg = null;
        /**
         * Map's graticule created with d3
         * @type {d3.Path}
         * @protected
         */
        this.graticule = null;
        /**
         * Instance's defined width taken from the element.
         * @type {number}
         * @protected
         */
        this.width = ele.offsetWidth;
        /**
         * Instance's defined height taken from the element.
         * @type {number}
         * @protected
         */
        this.height = ele.offsetHeight;


        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    WorldMap.prototype = {
        
        /**
         * Renders the map data with the given configurations.
         * @public
         * @param {Array} [data] Array set of initial MapPoint objects.
         * @returns {undefined}
         */
        render:function(data){
            this.data = data;
            
            for(var i = 0; i < data.length; i++){
                var d = data[i];
                
                MapPoint.make(this.mainSvg,this.projection,d);
            }
        },
        /**
         * Inits the basic instance's configurations.
         * @private
         * @returns {undefined}
         */
        init:function(){
            var w = this.width;
            var h = this.height;
            
            //CREATE PROJECTION (ROBINSON)
            var pro = d3.geoRobinson()
                    .scale(w/6.4)
                    .translate([w / 2, h / 2])
                    .precision(.1);
            
            //CREATE PATH BASED UPON PROJECTION
            var pt = d3.geo.path()
                    .projection(pro);
            
            //CREATE GRATICULE
            var gt = d3.geo.graticule();
            
            //SET SVG's STYLE PROPERTIES
            var svg = d3.select(this.element).append("svg")
                    .attr("width", w)
                    .attr("height", h);

            svg.append("defs").append("path")
                    .datum({type: "Sphere"})
                    .attr("id", "sphere")
                    .attr("d", pt);

            svg.append("use")
                    .attr("class", "stroke")
                    .attr("xlink:href", "#sphere");

            svg.append("use")
                    .attr("class", "fill")
                    .attr("xlink:href", "#sphere");

            svg.append("path")
                    .datum(gt)
                    .attr("class", "graticule")
                    .attr("d", pt);

            d3.json("js/world-50m.json", function (error, world) {
                if (error){
                    throw error;
                }
                    

                svg.insert("path", ".graticule")
                        .datum(topojson.feature(world, world.objects.land))
                        .attr("class", "land")
                        .attr("d", pt);

                svg.insert("path", ".graticule")
                        .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
                            return a !== b;
                        }))
                        .attr("class", "boundary")
                        .attr("d", pt);
            });

            d3.select(self.frameElement).style("height", h + "px");
            
            this.mainSvg = svg;
            this.path = pt;
            this.projection = pro;
            this.graticule = gt;
        }
    };
    
    /**
     * Returns a WorldMap instance
     * @param {DOMElement} element The DOMElement that will serve as a canvas for the map.
     * @param {Array.<Object>} [data] Optionaly you can set the map's data here or invoking the instance's "render" method.
     * @public
     * @static
     * @returns {WorldMap}
     */
    WorldMap.make = function(element,data){
        return new WorldMap(element,data);
    };


    //FACTORY's FINAL OBJECT
    return WorldMap;
});


