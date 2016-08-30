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

    };

    //PROTO
    Connector.prototype = {
        /**
         * Becomes an observer of a node's changes in the data being set.
         * @param {function} callback Function to call when the socket sends a data change.
         * @public
         * @returns {undefined}
         */
        observe: function (callback) {
            if (!this.observing) {
                var me = this;
                var ws = new WebSocket(this.socketUrl);

                //WHEN CONNECTION IS OPEN
                ws.onopen = function () {
                    me.connected = true;
                };

                ws.onmessage = function (evt) {
                    console.log("Socket Incoming", evt);
                    callback && callback.call(me, evt.data);
                };
                
                ws.onerror = function(){
                    me.observing = false;
                    setTimeout(function(){
                        me.observe(callback);
                    },me.RECONNECT);
                };

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
            var url = this.apiUrl + this.configurations.methods.set;
            url += "?data=" + encodeURI(JSON.stringify(data));

            var options = {method: "GET", success: success, error: error};

            $.ajax(url, options);
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
