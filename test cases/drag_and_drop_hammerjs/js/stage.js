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
            global.Stage = factory(document, Card);

})(this, function (document, Card) {
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
            this.cards.push(new Card(element));
        }
    };


    //FACTORY's FINAL OBJECT
    return Stage;
});


//PROVISONAL TOP HANDLERS
new Stage(document.getElementById("conceptStage"));