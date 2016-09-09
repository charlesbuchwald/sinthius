;
(function (global, factory) {
    //Hammer.js v2.0 -->
    if (typeof Hammer === 'undefined') {
        throw "Error Module [card]:: Hammer is not defined.";
    }
    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.Menu = factory($, document, Hammer);

})(this, function ($, document, Hammer) {
    'use strict';

    /**
     * Class that handles the Menu behaviour.
     * @param {Object} categories Categories to render.
     * @constructor
     */
    var Menu = function (auto) {
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
        this.categories = {};
        /**
         * JQuery object that contains the available menu holders
         * @type {JQuery}
         * @protected
         */
        this.JQmenuHolder = $('ul[data-menu="categories"]');

        this.container = $('.categories-menu');

        /**
         * Sets if there will be an auto-generated inside the selected
         * jQuery or if the menu will be rendered from the menu's items.
         */
        this.autoGenerated = auto;
        /**
         * Final array of categories
         */
        this.finalArray = [];

        this.expander = $("[menu-action='expand']");
        this.colapser = $("[menu-action='collapse']");
        
        /*
        this.max = this.container.attr("menu-max-size");
        this.min = this.container.attr("menu-min-size");
        */

        //this.init();

    };

    //PROTO
    Menu.prototype = {
        /**
         * Inital sets
         * @private
         * @returns {undefined}
         */
        init: function () {
            var me = this;
            if (!this.autogenerated) {
               

                this.JQmenuHolder.each(function () {
                    me.setUlEvent($(this));
//                    $(this).children("li").each(function () {
//                        me.setLiEvent($(this));
//                    });
                });
            }
            //Hammer implement
            var ele = this.container[0];
            this.ham = new Hammer(ele);

            //Hammer events
//            this.ham.on('swipeup', function (evt) {
//                me.open();
//            });
//
//            this.ham.on('swipedown', function (evt) {
//                me.close();
//            });

            this.expander.on("click", function () {
                var name = $(this).attr("menu-name");
                var menu = $("ul[name='"+name+"']");
                me.open(menu);
            });
            this.colapser.on("click", function () {
                var name = $(this).attr("menu-name");
                var menu = $("ul[name='"+name+"']");
                me.close(menu);
            });



            this.recollectData();
        },
        open: function (ob) {
            var size = ob.attr("menu-max-size");
            ob.animate({
                height: size
            });
        },
        close: function (ob) {
            var size = ob.attr("menu-min-size");
            ob.animate({
                height: size
            });
        },
        /**
         * This menu will render
         * @public
         * @returns {undefined}
         */
        addCatetories: function (categories) {
            if (this.autogenerated) {
                for (var i = 0; i < categories; i++) {
                    var cat = categories[i];
                    if (!this.categories[cat]) {
                        this.categories[cat] = true;

                        this.render(cat);
                    }
                }
            }
        },
        /**
         * Resets the current menu.
         * @public
         * @returns {undefined}
         */
        reset: function () {
            if (this.autoGenerated) {
                this.JQmenuHolder.children().remove();
                this.categories = {};
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
                li.attr("data-categories", category);


                this.JQmenuHolder.append(li);

                this.setLiEvent(li);
            }
        },
        setUlEvent: function (ul) {
            var me = this;
            var behaviour = ul.attr("data-behaviour");

            switch (behaviour) {
                default:
                case "exclusive":

                    ul.children("li").each(function () {
                        me.setExclusiveLiEvent($(this));
                    });

                    break;

                case "acumulative":

                    ul.children("li").each(function () {
                        me.setAcumulativeLiEvent($(this));
                    });

                    break;
            }
        },
        /**
         * Sets the event click on the li elements.
         * @param {jQuery} li
         * @returns {undefined}
         */
        setExclusiveLiEvent: function (li) {
            var me = this;
            li.on("click.category", function () {
                var cl = $(this);
                var lis = $(this).siblings("li");

                lis.removeClass(me.SELECTEDCLASS);
                cl.addClass(me.SELECTEDCLASS);

                me.recollectData();
                //me.selectCallback.call(me, data.split(","));
            });
        },
        setAcumulativeLiEvent: function (li) {
            var me = this;
            li.on("click.category", function () {
                var cl = $(this);
                if (cl.hasClass(me.SELECTEDCLASS)) {
                    cl.removeClass(me.SELECTEDCLASS);
                } else {
                    cl.addClass(me.SELECTEDCLASS);
                }
                me.recollectData();
            });
        },
        recollectData: function () {
            var fdata = [];
            var me = this;

            this.JQmenuHolder.each(function () {
                var part = [];
                $(this).find("li[data-categories]." + me.SELECTEDCLASS).each(function () {
                    var data = $(this).attr("data-categories");
                    var adata = data.split(",");
                    part = part.concat(adata);
                });
                fdata.push(part);
            });

            this.selectCallback && this.selectCallback.call(this, fdata);
        }
    };


    //FACTORY's FINAL OBJECT
    return Menu;
});
