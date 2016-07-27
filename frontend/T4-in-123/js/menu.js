;
(function (global, factory) {
    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.Menu = factory($, document);

})(this, function ($, document) {
    'use strict';

    /**
     * Class that handles the Menu behaviour.
     * @param {Object} categories Categories to render.
     * @constructor
     */
    var Menu = function (cats) {
        //CONSTANTS
        this.SELECTEDCLASS = "menu-selected";
        /**
         * Callback function that will be called upon selecting a category.
         * @protected
         * @type {number}
         */
        this.selectCallback = null;
        /**
         * List of all available categoires as pair of key-value.
         * @type {Object}
         * @protected
         */
        this.categories = cats;
        /**
         * JQuery object that contains the available menu holders
         * @type {JQuery}
         * @protected
         */
        this.JQmenuHolder = $('ul[data-menu="categories"]');


        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    Menu.prototype = {
        /**
         * Inits the basic configurations on the object.
         * @private
         * @returns {undefined}
         */
        init: function () {
            var cats = this.categories;
            for (var i in cats) {
                this.render(i);
            }
        },
        /**
         * Sets a callback for the onselect event.
         * @param {function} cb Callback
         * @returns {undefined}
         */
        onSelect: function (cb) {
            this.selectCallback = cb;
        },
        /**
         * Initiates the menu element for each category.
         * @param {string} category Category to render.
         * @private
         * @returns {undefined}
         */
        render: function (category) {
            if (category) {
                var li = $(document.createElement("li"));
                var me = this;

                li.text(category);
                li.attr("data-category", category);
                li.on("click.category", function () {
                    var cl = $(this);
                    var lis = me.JQmenuHolder.children("li");
                    
                    lis.removeClass(me.SELECTEDCLASS);
                    cl.addClass(me.SELECTEDCLASS);
                    
                    me.selectCallback.call(me, cl.attr("data-category"));
                });

                this.JQmenuHolder.append(li);
            }
        }
    };


    //FACTORY's FINAL OBJECT
    return Menu;
});
