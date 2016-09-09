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

    //Menu -->
    if (typeof Menu === 'undefined') {
        throw "Error Module [map]:: Menu is not defined.";
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
            global.WorldStage = factory($, self, d3, topojson, MapPoint, Menu);

})(this, function ($, self, d3, topojson, MapPoint, Menu) {
    'use strict';

    /**
     * Class that handles the WorldStage behaviour.
     * @param {Array} [data] Optional data object. Data can also be set on WorldStage#render method.
     * @constructor
     */
    var WorldStage = function (data) {
        /**
         * TIME IN SECONS THE STAGE HAS TO BE USER UNHANDLED IN ORDER TO
         * BE ABLE TO USE OVERRIDE CONTROLS
         * @type {number}
         * @constant
         */
        this.USER_HANDLE_TIMEOUT = 180;
        /**
         * Local instance reference of the global configurations
         * @type {WorldStage.Configurations}
         * @public
         * @memberOf WorldStage
         */
        this.Configurations = WorldStage.Configurations;
        /**
         * DOMElement that will hold the map canvas upon rendering.
         * the map will auto-adjust to this element's bounding limits.
         * @type {DOMElement}
         * @protected
         */
        this.element = null;
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
        this.width = null;
        /**
         * Instance's defined height taken from the element.
         * @type {number}
         * @protected
         */
        this.height = null;
        /**
         * Marks with an UNIX timestamp the last time any card was handled.
         * @type {number}
         * @protected
         */
        this.setLastHandledAt = 0;
        /**
         * Array of map data points
         * @protected
         * @type {Array<MapPoint>}
         */
        this.points = [];
        /**
         * States the status of the broadcast mode
         * @type Boolean
         * @protected
         */
        this.broadcast = false;
        /**
         * Callback that will handle the broadcast
         * @type function
         * @protected
         */
        this.broadcastSelectionCallback = null;

        this.mapmade = false;
    };

    //PROTO
    WorldStage.prototype = {
        /**
         * When set this mode on, the callback broadcastSelection is triggered
         * when tags are injected into the map for filtering.
         * @param {Boolean} state
         * @returns {undefined}
         * @public
         */
        setBroadcastMode: function (state) {
            this.broadcast = state;
        },
        /**
         * Sets the callback for selection
         * @param {function} callback
         * @returns {undefined}
         * @public
         */
        onBroadcastSelection: function (callback) {
            this.broadcastSelectionCallback = callback;
        },
        /**
         * Renders the map data with the given configurations.
         * @public
         * @param {Array} [data] Array set of initial MapPoint objects.
         * @returns {undefined}
         */
        render: function (data) {
            if((typeof data).toLowerCase() == "string"){
                this.remoteRender(data);
                return;
            }
            
            var me = this;
            if (this.mapmade) {
                this.data = data;

                this.points = [];
                //ITERATE TO EVAL
                var keymap = {};
                
                for (var i = 0; i < data.length; i++) {
                    var d = data[i];
                    if(d.country && d.country != ""){
                        var key = d.country+d.type;
                        if(!keymap[key]){
                            keymap[key]=[];
                        }
                        keymap[key].push(d);
                    }
                    
                }
                for(var i in keymap){
                    var set = keymap[i];
                    this.points.push(MapPoint.make(this.element, this.mainSvg, this.projection, set,this.Configurations));
                }
            }else{
                setTimeout(function(){
                    me.render(data);
                },1000);
            }
            
            this.menus.setDefault();
        },
        /**
         * Renders from a json data
         * @param {String} url
         * @returns {undefined}
         * @public
         */
        remoteRender:function(url){
            var me = this;
            $.ajax({
                url:url,
                dataType:"json",
                method:"get",
                success:function(data){
                    me.render(data.data);
                },
                error:function(e){
                    console.error(e);
                }
            });
        },
        /**
         * Inits the basic instance's configurations.
         * @param {string} [id] Optional selector id.
         * @public
         * @returns {undefined}
         */
        init: function (id) {
            var me = this;
            var ele = document.getElementById(id || this.Configurations.stage);
            var w = ele.offsetWidth;
            var h = ele.offsetHeight;

            //CREATE PROJECTION (ROBINSON)
            var pro = d3.geoRobinson()
                    .scale(w / 5.5)
                    .translate([w / 2, h / 2])
                    .precision(.1);

            //CREATE PATH BASED UPON PROJECTION
            var pt = d3.geo.path()
                    .projection(pro);

            //CREATE GRATICULE
            var gt = d3.geo.graticule();

            //SET SVG's STYLE PROPERTIES
            var svg = d3.select(ele).append("svg")
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
                if (error) {
                    throw error;
                }


                /* svg.insert("path", ".graticule")
                 .datum(topojson.feature(world, world.objects.land))
                 .attr("class", "land")
                 .attr("d", pt);*/

                svg.selectAll(".countries")
                        .data(topojson.feature(world, world.objects.countries).features)
                        .enter()
                        .append("path")
                        .on("mouseover", function () {
                            d3.select(this).style("fill", "#e3e8ca");
                        })
                        .on("mouseout", function () {
                            d3.select(this).style("fill", "#aeaeae");
                        })
                        .attr("style", "fill:" + "#aeaeae")
                        .attr("class", "country")
                        .attr("d", pt);

                svg.insert("path", ".graticule")
                        .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
                            return a !== b;
                        }))
                        .attr("class", "boundary")
                        .attr("d", pt);
                
                me.mapmade = true;
            });

            d3.select(self.frameElement).style("height", h + "px");

            this.mainSvg = svg;
            this.path = pt;
            this.projection = pro;
            this.graticule = gt;
            this.width = w;
            this.height = h;

            this.element = ele;


            //MENU
            this.menus = new Menu(this.Configurations.automenu, this.Configurations.menuType);
            this.menus.onSelect(function (selection) {

                me.innerSelectCategories(selection);
            });
        },
        /**
         * Once invoked this method, the stage will try to override the control of the screen to programaticaly
         * select the given categories only if the user's last interaction allows it.
         * @public
         * @memberOf Stage
         * @instance
         * @param {string|Array} categories Is a string or an Array of strings that represent the categories that should pop over
         * @returns {undefined}
         */
        selectCategories: function (categories) {
            if (this.allowOverride()) {
                this.innerSelectCategories(categories);
                return true;
            }
            return false;
        },
        /**
         * Selects cetain category to focus and display.
         * @memberOf Stage
         * @private
         * @returns {undefined}
         */
        innerSelectCategories: function (selection) {
            if (this.broadcast) {
                this.broadcastSelectionCallback && this.broadcastSelectionCallback.call(this, selection);
            }

            var menus = this.menus;
            /** @param {MapPoint} card */
            this.iteratePoints(function (point) {
                point.inject(selection);
            });
        },
        /**
         * Iterates over all the points.
         * @param {function} callback function that will be executed on each step of the iteration.
         * @private
         * @memberOf Stage
         * @returns {undefined}
         */
        iteratePoints: function (callback) {
            var c = this.points,
                    l = c.length,
                    i;

            for (i = 0; i < l; i++) {
                callback.call(this, c[i]);
            }

        },
        /**
         * Gets if the stage can allow an override method.
         * @private
         * @memberOf Stage
         * @returns {Boolean}
         */
        allowOverride: function () {
            var now = new Date().getTime();

            if (this.setLastHandledAt + this.USER_HANDLE_TIMEOUT > now) {
                return false;
            }
            return true;
        }
    };
    /**
     * Global configurations
     * @public
     * @static
     * @memberOf WorldStage
     */
    WorldStage.Configurations = {
        /**
         * Stage id value
         * @type {string}
         */
        stage: "stage",
        /**
         * Categories Menu jQuery selector
         * @type {string}
         */
        menuSelector: "[data-menu='categories']",
        /**
         * Sets if the menu should be autogenerated
         * @type {boolean}
         */
        automenu: false,
        /**
         * Sets if the categories/tags applied to the map
         * should stack or should they be exclusive.
         * @type {boolean}
         */
        menuType: Menu.TYPE_FILTER_AND_STACK
    };


    //FACTORY's FINAL OBJECT
    return WorldStage;
});


//GLOBAL INITIALIZATION OF THE WORLD MAP TABLE
// DO NOT CHANGE -->
(function (global) {
    /** @type {WorldStage} */
    global.WorldMap = new WorldStage();
})(this);
// <-----