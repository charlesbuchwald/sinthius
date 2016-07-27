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
            global.Stage = factory($,document, Card, Menu);

})(this, function ($, document, Card, Menu) {
    'use strict';

    /**
     * Class that handles the Stage behaviour.
     * @param {DOMElement} ele DOM Element that will act as stage container/canvas
     * @param {Object} [opts] Optional params
     * @constructor
     */
    var Stage = function (ele, opts) {
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
         * JQuery object that contains the available menu holders
         * @type {JQuery}
         * @protected
         */
        this.JQmenuHolder = $('[data-menu="categories"]');
        

        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    Stage.prototype = {
        
        /**
         * Inits the basic configurations on the object.
         * @private
         * @returns {undefined}
         */
        init: function () {
            var me = this;
            
            //CANVAS INIT -->
            
            
            //CARDS INIT -->
            var x = document.getElementsByClassName("card");
            var len = x.length;
            
            for(var i = 0; i < len; i++){
                /** @type {DOMElement} */
                var el = x.item(i);
                
                this.initCard(el);
            }
            
            //CATEGORIES --->
            /** @type {Menu} */
            this.menu = new Menu(this.categories);
            this.menu.onSelect(function(category){
                /** @param {Card} card */
                me.iterateCards(function(card){
                    if(card.hasCategory(category)){
                        card.moveLayerMiddle();
                    }else{
                        card.moveLayerBottom();
                    }
                });
            });
            
        },
        /**
         * Initiates the Card element into the stage.
         * @private
         * @returns {undefined}
         */
        initCard: function(element){
            /** @type {Card} */
            var card = new Card(element);
            
            //EVENTS FOR GLOBAL CONTROL
            card.ham.on("pinchstart tap",(function(me,c){
                return function(event){
                    me.focus(c);
                };
            })(this,card));
            
            //ADD TO AVAILABLE CATEGORIES
            var cats = card.categories;
            for(var i in cats){
                this.categories[i] = true; 
            }
            
            
            this.cards.push(card);
        },
        /**
         * Handles the focus on certain card.
         * @param {Card} card
         * @returns {undefined}
         */
        focus:function(card){
            //ONLY ONE CARD CAN BE FOCUSED.
            /** @param {Card} singlecard */
            this.iterateCards(function(singlecard){
                if(singlecard.isTop()){
                    singlecard.moveLayerBack();
                }
            });
            
            card.moveLayerTop();
            
        },
        /**
         * Forces a focus on the given card
         * @param {Card} card
         * @public
         * @returns {undefined}
         */
        forceFocus:function(card){
            card.moveLayerTop();
            this.currentFocusedCard = card;
        },
        
        /**
         * Iterates over all the cards.
         * @param {function} callback function that will be executed on each step of the iteration.
         * @public
         * @returns {undefined}
         */
        iterateCards:function(callback){
            var c = this.cards,
            l = c.length,
            i;
    
            for(i = 0; i < l; i++){
                callback.call(this,c[i]);
            }
            
        },
        /**
         * Renders a menu with all the collected categories.
         * @private
         * @returns {undefined}
         */
        renderCategoryMenu: function(){
            var cats = this.categories;
            var jq = this.JQmenuHolder;
        }
    };


    //FACTORY's FINAL OBJECT
    return Stage;
});


//PROVISONAL TOP HANDLERS
new Stage(document.getElementById("conceptStage"));