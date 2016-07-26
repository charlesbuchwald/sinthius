;
(function (global, factory) {
    //Check dependencies.
    //Card -->
    if (typeof Card === 'undefined') {
        throw "Error Module [stage]:: Card is not defined.";
    }

    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.Stage = factory($,document, Card);

})(this, function ($, document, Card) {
    'use strict';

    /**
     * Class that handles the Stage behaviour.
     * @param {DOMElement} ele DOM Element that will act as stage container/canvas
     * @param {Object} [opts] Optional params
     * @constructor
     */
    var Stage = function (ele, opts) {
        
        
        /**
         * Card Array
         * @type {Array.<Card>}
         * @protected
         */
        this.cards = [];
        /**
         * Stores the reference to the current focused card
         * @type {Card}
         * @protected
         */
        this.currentFocusedCard = null;
        

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
            card.ham.on("tap",(function(me,c){
                return function(event){
                    me.focus(c);
                };
            })(this,card));
            
            card.ham.on("pinchstart",(function(me,c){
                return function(event){
                    me.forceFocus(c);
                };
            })(this,card));
            
            this.cards.push(card);
        },
        /**
         * Handles the focus on certain card.
         * @param {Card} card
         * @returns {undefined}
         */
        focus:function(card){
            if(this.currentFocusedCard){
                this.currentFocusedCard.moveLayerBack();
            }
            if(card !== this.currentFocusedCard){
                card.moveLayerTop();
                this.currentFocusedCard = card;
            }else{
                this.currentFocusedCard = null;
            }
            
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
        }
    };


    //FACTORY's FINAL OBJECT
    return Stage;
});


//PROVISONAL TOP HANDLERS
new Stage(document.getElementById("conceptStage"));