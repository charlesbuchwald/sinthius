;
(function (global, factory) {
    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.ConnectorClass = factory($, document);

    //GLOBAL REFERENCE
    global.Connector = new global.ConnectorClass();

})(this, function ($, document) {
    'use strict';

    /**
     * Creates a websocket and or an API HTTP connection to a NUC Server.
     * @constructor
     */
    var Connector = function () {
        /**
         * Time stablished for waiting before trying to reconnect to the
         * socket.
         * @constant
         * @type Number
         */
        this.RECONNECT = 15000;
        /**
         * Instance's local reference to the configurations.
         * @type Object
         * @protected
         */
        this.configurations = Connector.Configurations;
        /**
         * Socket URL
         * @type String
         * @protected
         */
        this.socketUrl = this.configurations.socket;
        /**
         * API URL
         * @type String
         * @protected
         */
        this.apiUrl = this.configurations.api;
        /**
         * Instance's websocket.
         * @type WebSocket
         * @protected
         */
        this.socket = null;
        /**
         * States if the socket is connected or not.
         * @type Boolean
         * @public
         * @readonly
         */
        this.connected = false;
        /**
         * State that determines if the client if observing.
         * @type Boolean
         * @public
         * @readonly
         */
        this.observing = false;
        /**
         * A list of possible IP's to send the broadcast.
         * @type {Array}
         * @protected
         */
        this.broadcastElementIPs = []; 

    };

    //PROTO
    Connector.prototype = {
        /**
         * When invoked the method will lookup in the API's node list the matching
         * elements and add them to the pool of broadcast screens.
         * @param {string} findby Possible values: "name","ip"
         * @param {type} elements
         * @returns {undefined}
         */
        connect:function(findby,elements){
            switch(findby){
                case "name":
                    this.findNames(elements);
                    break;
                case "ip":
                    this.broadcastElementIPs = elements;
                    break;
            }
        },
        /**
         * Becomes an observer of a node's changes in the data being set.
         * @param {string} websocket URL
         * @param {function} callback Function to call when the socket sends a data change.
         * @public
         * @returns {undefined}
         */
        observe: function (websocket,callback) {
            if (!this.observing) {
                
                var me = this;
                var ws = new WebSocket(websocket);

                //WHEN CONNECTION IS OPEN
                ws.onopen = function () {
                    me.connected = true;
                };

                ws.onmessage = function (evt) {
                    console.log("Socket Incoming", evt);
                    var data = null;
                    try{
                        data = JSON.parse(evt.data);
                    }catch(e){
                        console.log("Cannot parse data",e);
                    }
                    callback && callback.call(me, data);
                };
                
                ws.onerror = function(){
                    me.observing = false;
                    setTimeout(function(){
                        me.observe(callback);
                    },me.RECONNECT);
                };
                this.socketUrl = websocket;
                this.socket = ws;
                this.observing = true;
            }
        },
        /**
         * Sets this data as the current node's information.
         * @param {string} data Data as string to be set.
         * @param {function} [success] Success callback.
         * @param {function} [error] Error callback.
         * @public
         * @returns {undefined}
         */
        broadcast: function (data, success, error) {
            for(var i in this.broadcastElementIPs){
                var ip = this.broadcastElementIPs[i];
                var url = "http://"+ip+this.configurations.methods.set;
                
                url += "?data=" + encodeURI(JSON.stringify(data));
                var options = {method: "GET", success: success, error: error};
                $.ajax(url, options);
            }
        },
        /**
         * Requests this screen lock
         * @public
         * @returns {undefined}
         */
        lock:function(){
            var me = this;
            var furl = this.configurations.api+"/node/lock";
            $.ajax({
                url:furl,
                method:"GET",
                dataType:"json"
            });
        },
        /**
         * Requests this screen unlock
         * @public
         * @returns {undefined}
         */
        unlock:function(){
            var me = this;
            var furl = this.configurations.api+"/node/unlock";
            $.ajax({
                url:furl,
                method:"GET",
                dataType:"json"
            });
        },
        /**
         * Finds the IP's of the names in the list.
         * @param {Array} list
         * @private
         * @returns {undefined}
         */
        findNames:function(list){
            var me = this;
            var furl = this.configurations.api+"/nodes/cache";
            $.ajax({
                url:furl,
                method:"GET",
                dataType:"json",
                success:function(json){
                    me.matchNames(json.response,list);
                }
            });
        },
        /**
         * Matches the names in the list to the ones in the result to store a list of IPs
         * @private
         * @returns {undefined}
         */
        matchNames:function(responselist,list){
            var finallist = [];
            
            for(var i in responselist){
                var ob = responselist[i];
                
                var name = ob.name;
                var ip = ob.ip+":"+ob.port;
                var index = list.indexOf(name);
                
                if(index !== -1){
                    finallist.push(ip);
                }
            }
            this.broadcastElementIPs = finallist;
        }

    };
    /**
     * Global connector configurations
     * @namespace
     * @memberOf Connector
     */
    Connector.Configurations = {
        /**
         * API HTTP Address
         * @type String
         * @static
         */
        api: "http://localhost:4000/api",
        /**
         * Websocket address.
         * @type String
         * @static
         */
        socket: "ws://localhost:4000/ws/observer",
        /**
         * API Method URIs
         * @type Object
         * @static
         */
        methods: {
            /**
             * Sets data
             */
            set: "/set"
        }
    };


    //FACTORY's FINAL OBJECT
    return Connector;
});
