/** @class Stage */
;
(function (global, factory) {
    //Check dependencies.
    //Card -->
    if (typeof Card === 'undefined') {
        throw "Error Module [stage]:: Card is not defined.";
    }
    //Card -->
    if (typeof Menu === 'undefined') {
        throw "Error Module [stage]:: Menu is not defined.";
    }

    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.Stage = factory($, document, Card, Menu);

})(this, function ($, document, Card, Menu) {
    'use strict';

    /**
     * Class that handles the Stage behaviour.
     * @param {DOMElement} ele DOM Element that will act as stage container/canvas
     * @constructor
     */
    var Stage = function (ele) {
        /**
         * Instance's configurations.
         * @public
         * @static
         * @memberOf Stage
         */
        this.Configurations = Stage.Configurations;
        /**
         * TIME IN SECONS THE STAGE HAS TO BE USER UNHANDLED IN ORDER TO
         * BE ABLE TO USE OVERRIDE CONTROLS
         * @type {number}
         * @constant
         */
        this.USER_HANDLE_TIMEOUT = 180;
        /**
         * Element that represents the canvas.
         * @protected
         * @type {DOMElement}
         */
        this.element = ele;
        /**
         * Menu object bounded to the stage.
         * @protected
         * @type {Menu}
         */
        this.menu = null;

        /**
         * Card Array
         * @type {Array.<Card>}
         * @protected
         */
        this.cards = [];
        /**
         * List of all available categoires as pair of key-value.
         * @type {Object}
         * @protected
         */
        this.categories = {};
        /**
         * Marks with an UNIX timestamp the last time any card was handled.
         * @type {number}
         * @protected
         */
        this.setLastHandledAt = 0;
        /**
         * JQuery object that contains the available menu holders
         * @type {JQuery}
         * @protected
         */
        this.JQmenuHolder = null;

    };

    //PROTO
    Stage.prototype = {
        /**
         * Inits the stage with the based configurations
         * @param {string} [stagecontainer] Optional stage container to render on. This will override the "stage" set in Configurations. 
         * @memberOf Stage
         * @instance
         * @public
         * @returns {undefined}
         */
        init: function (stagecontainer) {
            var me = this;
            var configs = this.Configurations;

            this.element = document.getElementById(stagecontainer || configs.stage);
            this.JQmenuHolder = $(configs.menuSelector);

            //CANVAS INIT -->

            //CATEGORIES --->
            /** @type {Menu} */
            this.menu = new Menu(configs.automenu);
            this.menu.onSelect(function (category) {
                me.innerSelectCategories(category);
            });
        },
        /**
         * On handle event
         * @param {function} callback
         * @returns {undefined}
         * @public
         */
        onHandle: function (callback) {
            this.onHandleCallback = callback;
        },
        /**
         * On unhandle event.
         * @param {function} callback
         * @returns {undefined}
         * @public
         */
        onUnhandle: function (callback) {
            this.onHandleEndCallback = callback;
        },
        /**
         * This method will render the given data into cards.
         * Invoking this method will remove the current cards in
         * the canvas.
         * @public
         * @memberOf Stage
         * @instance
         * @returns {undefined}
         */
        render: function (data) {
            if((typeof data).toLowerCase() == "string"){
                this.remoteRender(data);
                return;
            }
            var jqElement = $(this.element);

            if (data) {

                jqElement.children().remove();
                this.menu.reset();

                for (var i = 0; i < data.length; i++) {
                    this.addCard(data[i]);
                }
            }

            //SORTER
            this.sortRandom();
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
         * This method will render a single card by it's given data.
         * Invoking this method will add the card into the already
         * rendered group of cards.
         * @public
         * @memberOf Stage
         * @instance
         * @returns {undefined}
         */
        addCard: function (data) {
            var dom = Card.createCardElement(data);
            this.element.appendChild(dom);
            this.menu.addCatetories(data.categories);

            this.initCard(dom);
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
         * @param {string|Array} categories Is a string or an Array of strings that represent the categories that should pop over
         * @returns {undefined}
         */
        innerSelectCategories: function (categories) {
            /** @param {Card} card */
            this.iterateCards(function (card) {
                var state = true;
                for (var i = 0; i < categories.length; i++) {
                    var b = categories[i];
                    if (b && b.length && !card.hasCategory(b)) {
                        state = false;
                        continue;
                    }
                }
                if (state) {
                    card.moveLayerMiddle();
                } else {
                    card.moveLayerBottom();
                }
            });
        },
        /**
         * Initiates the Card element into the stage.
         * @memberOf Stage
         * @private
         * @returns {undefined}
         */
        initCard: function (element) {
            var me = this;
            /** @type {Card} */
            var card = new Card(element);

            //EVENTS FOR GLOBAL CONTROL
            card.ham.on("pinchstart tap", (function (me, c) {
                return function (event) {
                    me.focus(c);
                };
            })(this, card));

            //ADD TO AVAILABLE CATEGORIES
            var cats = card.categories;
            for (var i in cats) {
                this.categories[i] = true;
            }


            this.cards.push(card);

            card.onHandleEnd(function () {
                me.setLastHandledAt = new Date().getTime() / 1000;
                me.onHandleEndCallback && me.onHandleEndCallback.call();
            });
            card.onHandle(function () {
                me.onHandleCallback && me.onHandleCallback.call();
            });
        },
        /**
         * Gets the current width size of the canvas element.
         * @memberOf Stage
         * @private
         * @returns {number}
         */
        getCanvasSizeX: function () {
            return this.element.offsetWidth;
        },
        /**
         * Gets the current height size of the canvas element.
         * @private
         * @memberOf Stage
         * @returns {number}
         */
        getCanvasSizeY: function () {
            return this.element.offsetHeight;
        },
        /**
         * Handles the focus on certain card.
         * @param {Card} card
         * @memberOf Stage
         * @instance
         * @public
         * @returns {undefined}
         */
        focus: function (card) {
            //ONLY ONE CARD CAN BE FOCUSED.
            /** @param {Card} singlecard */
            this.iterateCards(function (singlecard) {
                if (singlecard.isTop()) {
                    singlecard.moveLayerBack();
                }
            });

            card.moveLayerTop();

        },
        /**
         * Forces a focus on the given card
         * @param {Card} card
         * @private
         * @memberOf Stage
         * @returns {undefined}
         */
        forceFocus: function (card) {
            card.moveLayerTop();
            this.currentFocusedCard = card;
        },
        /**
         * Iterates over all the cards.
         * @param {function} callback function that will be executed on each step of the iteration.
         * @private
         * @memberOf Stage
         * @returns {undefined}
         */
        iterateCards: function (callback) {
            var c = this.cards,
                    l = c.length,
                    i;

            for (i = 0; i < l; i++) {
                callback.call(this, c[i]);
            }

        },
        /**
         * Sorts the cards randomly across the available canvas.
         * @public
         * @memberOf Stage
         * @instance
         * @returns {undefined}
         */
        sortRandom: function () {
            var M = Math,
                    minX = 0,
                    minY = 0,
                    maxX = this.getCanvasSizeX(),
                    maxY = this.getCanvasSizeY();


            /** @param {Card} */
            this.iterateCards(function (card) {
                var rx = M.floor(M.random() * (maxX - minX + 1)) + minX;
                var ry = M.floor(M.random() * (maxY - minY + 1)) + minY;

                card.moveTo(rx, ry);
            });
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
     * Global static configurations for any stage
     * @memberOf Stage
     * @static
     * @public
     */
    Stage.Configurations = {
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
         * Creates a custom menu based on the available categories.
         * @type {boolean}
         */
        automenu: true
    };


    //FACTORY's FINAL OBJECT
    return Stage;
});



//GLOBAL INITIALIZATION OF THE CLOUD BROWSER
// DO NOT CHANGE -->
(function (global) {
    /** @type {Stage} */
    global.CloudBrowser = new Stage(document.getElementById("stage"));
})(this);
// <-----
