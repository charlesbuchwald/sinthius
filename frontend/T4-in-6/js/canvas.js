;
(function (global, factory) {
    //Check dependencies.
    //Card -->
    if (typeof CNumber === 'undefined') {
        throw "Error Module [stage]:: CNumber is not defined.";
    }
    //Hammer.js v2.0 -->
    if (typeof Hammer === 'undefined') {
        throw "Error Module [card]:: Hammer is not defined.";
    }


    //MODULE EXPORTS
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            //AMD MODULE
            typeof define === 'function' && define.amd ? define(factory) :
            //GLOBAL REFERENCE
            global.Canvas = factory($, document, CNumber, Hammer);

})(this, function ($, document, CNumber, Hammer) {
    'use strict';

    /**
     * Class that handles the Canvas behaviour.
     * @param {DOMElement} ele DOM Element that will act as canvas
     * @constructor
     */
    var Canvas = function (ele, data, defaultLang) {
        //CONSTANTS --->
        /** NUMBER CARD WIDTH */
        this.WIDTH = 350;
        /** MARGIN WIDTH */
        this.MARGIN = 10;
        
        this.lang = defaultLang;
        /**
         * Determines how many extra linear elements must be
         * placed in order to cover all canvas area.
         * @type {number}
         * @protected
         */
        this.extras = 2;

        /**
         * Real Card number distance
         * @type {number}
         * @protected
         */
        this.distance = this.WIDTH + (this.MARGIN * 2);
        /**
         * Class with the transformation ease attributes
         * for the slowing effect.
         * 
         */
        this.easeClass = "transform-numbers-ease";
        /**
         * DOM Element for the canvas.
         * @type {DOMElement}
         */
        this.element = ele;

        /**
         * Card Array
         * @type {Array.<CNumbers>}
         * @protected
         */
        this.numbers = data;
        /**
         * Last successful value set to the x transformation
         * @protected
         * @type {number}
         */
        this.lastX = 0;
        /**
         * jQuery object from the DOMElement
         * @type {jQuery}
         * @protected
         */
        this.jQueryElement = $(this.element);
        /**
         * Parent jQuery object from the DOMElement
         * @type {jQuery}
         * @protected
         */
        this.numbersRow = this.jQueryElement.parent();
        /**
         * Amount of pan made to the left
         * @type {number}
         * @protected
         */
        this.panned = 0;
        /**
         * Current index of the ncard to be loaded on the left side of the tile.
         * @type {number}
         * @protected
         */
        this.leftIndex = 0;
        /**
         * Current index of the ncard to be loaded on the right side of the tile.
         * @type {number}
         * @protected
         */
        this.rightIndex = 0;
        /**
         * Pixel location of the scroll.
         * @type {number}
         * @private
         */
        this.scrollLocation = 0;
        /**
         * Array of CNumber objects currently present on the physical
         * view of the wheel.
         * @protected
         * @type {Array.<CNumber>}
         */
        this.wheel = [];



        //CALL TO PROTO METHOD init.
        this.init();
    };

    //PROTO
    Canvas.prototype = {
        /**
         * Inits the basic configurations on the object.
         * @private
         * @returns {undefined}
         */
        init: function () {
            var me = this;
            
            if((typeof this.numbers).toLowerCase() == "string"){
                $.ajax({
                    url:this.numbers,
                    dataType:"json",
                    method:"get",
                    success:function(data){
                        me.numbers = data.data;
                        me.init();
                    }
                });
                return;
            }

            this.loadNumberCards();

            //HAMMER EVENTS - PAN
            this.ham = new Hammer(this.element.parentNode);
            //Hammer events
            this.ham.on('panend', function (evt) {
                me.onPanEnd(evt);
            });
            this.ham.on('panstart', function (evt) {
                me.onPanStart(evt);
            });
            this.ham.on('panmove', function (evt) {
                me.onPan(evt);
            });


            //PAN CONFIGURATIONS
            this.ham.get('pan').set({threshold: 0, direction: Hammer.DIRECTION_HORIZONTAL});
            
            
            $("[lang]").on("click",function(){
                var l = $(this).attr("lang");
                $("[lang]").removeClass("selected-lang");
                $(this).addClass("selected-lang");
                console.log("change lang",l);
                me.changeLanguage(l);
            });

        },
        changeLanguage:function(lang){
            this.lang = lang;
            for(var i in this.wheel){
                var w = this.wheel[i];
                w.setLanguage(lang);
            }
        },
        /**
         * Gets the number of extra cards that should be loaded to the left and to the right
         * in orther to cover all screen/canvas available space.
         * @private
         * @returns {number}
         */
        calculateExtras:function(){
            var w = this.element.offsetWidth;
            var cd = this.distance;
            var shouldbe = Math.floor(w/cd)+2;
            var thereare = this.numbers.length;
            //ONLY IF NEEDED EXTRAS -->
            if(thereare < shouldbe){
                var extrastotal = shouldbe-thereare;
                //FROM EXTRA TOTAL GET ONLY EXTRA ON EACH SIDE -->
                var realextra =  Math.ceil(extrastotal/2);
                return realextra;
                
            }
            //IF NO NEEDED (numbers HAS ENOUGH CARDS TO COVER SCREEN)-->
            return 0;
            
            
        },
        /**
         * Makes the initial card construction
         * @private
         * @returns {undefined}
         */
        loadNumberCards: function () {
            this.extras = this.calculateExtras();

            this.currentLeftIndex = (0 - this.extras);
            this.currentRightIndex = (this.numbers.length + this.extras - 1);

            

            //THE OTHER THAN FIRST AS LAST
            var initial = this.currentLeftIndex + 1;
            for (var i = initial; i <= this.currentRightIndex; i++) {
                this.loadACard(i);
            }
            //FIRST ELEMENT REGISTERED AS FIRST
            this.loadACard(this.currentLeftIndex, true);
            //this.jQueryElement.css("width", (this.jQueryElement.children().length * this.distance) + "px");
        },
        /**
         * Loads a card by index;
         * @public
         * @param {number} i Index from the "numbers" property.
         * @param {boolean} [first] If present and true states that the loading should be as first element.
         * @returns {undefined}
         */
        loadACard: function (i, first) {
            var n = this.numbers;
            var ri = this.realIndex(i);

            var num = new CNumber(n[ri], this.WIDTH, this.MARGIN, i, this.lang);
            if (first) {
                
                this.registerFirstNumber(num);
            } else {
                
                this.registerLastNumber(num);
            }

        },
        /**
         * Executes the instructions to move the view according to the
         * pan gesture.
         * @private
         * @returns {undefined}
         */
        onPan: function (event) {
            /** @param {CNumber} */
            this.iterateWheel(function (cnumber) {
                cnumber.pan(event);
            });
        },
        /**
         * Actions to be executed on pan start
         * @param {HammerEvent} event
         * @private
         */
        onPanStart: function (evt) {
            /** @param {CNumber} */
            this.iterateWheel(function (cnumber) {
                cnumber.panStart();
            });
        },
        /**
         * Sets the final attribs according to the final pan position.
         * @private
         * @returns {undefined}
         */
        onPanEnd: function (evt) {
            /** @param {CNumber} */
            this.iterateWheel(function (cnumber) {
                cnumber.panEnd(evt);
            });


            //this.panned += evt.distance;
            //this.panned = this.evalPan(this.panned);


        },
        /**
         * Registers a new CNumber object in the wheel at the end of it.
         * @param {CNumber} cnumber CNumber object.
         * @private
         * @returns {undefined}
         */
        registerLastNumber: function (cnumber) {
            var me = this;
            this.jQueryElement.append(cnumber.jquery());
            var i = this.wheel.push(cnumber) - 1;
            var prev = i - 1;
            var left = 0;
            //this.jQueryElement.css("width", (this.jQueryElement.children().length * this.distance) + "px");

            //PREVIOUS CARD NOW IGNORES THE BOUND REACHING EVENT
            if (prev >= 0) {
                var p = this.wheel[prev];
                p.ignore();
                left = p.getLeft() + this.distance;
            }
            //NEW CARD INITS AND ADDS THE BOUND REACHING EVENT.
            cnumber.init(left);
            
            cnumber.listen(function (l) {
                if (l < this.limit) {
                    me.proceed(1);
                }
            });
        },
        /**
         * Registers a new CNumber object in the wheel at the beginning of it.
         * @param {CNumber} cnumber CNumber object.
         * @private
         * @returns {undefined}
         */
        registerFirstNumber: function (cnumber) {
            var me = this;
            
            
            this.jQueryElement.prepend(cnumber.jquery());
            this.wheel.unshift(cnumber);
            //this.jQueryElement.css("width", (this.jQueryElement.children().length * this.distance) + "px");
            var prev = 1;
            var left = 0;

            //PREVIOUS CARD NOW IGNORES THE BOUND REACHING EVENT
            if (prev < this.wheel.length) {
                var p = this.wheel[prev];
                p.ignore();
                left = p.getLeft() - this.distance;
            }
            //NEW CARD INITS AND ADDS THE BOUND REACHING EVENT.
            cnumber.init(left);
            
            cnumber.listen(function (l) {
                
                if (l > 0) {
                    me.proceed(-1);
                }
            });
        },
        /**
         * Un-Registers a new CNumber object in the wheel.
         * @private
         * @returns {undefined}
         */
        unregisterLastNumber: function () {
            this.wheel.pop();

            var me = this;
            var n = this.wheel[this.wheel.length - 1];

            n.listen(function (l) {
                if (l < this.limit) {
                    me.proceed(1);
                }
            });

        },
        /**
         * Un-Registers a new CNumber object in the wheel.
         * @private
         * @returns {undefined}
         */
        unregisterFirstNumber: function () {
            this.wheel.shift();

            var me = this;
            var n = this.wheel[0];

            n.listen(function (l) {
                if (l > 0) {
                    me.proceed(-1);
                }
            });
        },
        /**
         * Makes the jQuery/CNumber Card Adding/Removal procedures to the start/end
         * of the reel depending on the direction.
         * @private
         * @param {number} dir Direction can be either 1 or -1
         * @returns {undefined}
         */
        proceed: function (dir) {
            var booldir = (dir === 1);
            if (booldir) {
                //ADD TO THE END OF THE WHEEL
                this.currentRightIndex = this.realIndex(this.currentRightIndex + 1);

                //ADD ELEMENT TO THE LAST
                var cnumber = new CNumber(this.numbers[this.currentRightIndex], this.WIDTH, this.MARGIN,this.currentRightIndex,this.lang);
                this.registerLastNumber(cnumber);

                //REMOVE FIRST ELEMENT OF THE WHEEL
                var firstChild = this.jQueryElement.children().first();
                this.unregisterFirstNumber();
                firstChild.remove();

                //this.lastX += this.distance;




            } else {
                //ADD TO THE BEGINING OF THE WHEEL
                this.currentLeftIndex = this.realIndex(this.currentLeftIndex - 1);

                //ADD ELEMENT TO THE LAST
                var cnumber = new CNumber(this.numbers[this.currentLeftIndex], this.WIDTH, this.MARGIN, this.currentLeftIndex, this.lang);
                this.registerFirstNumber(cnumber);

                //REMOVE FIRST ELEMENT OF THE WHEEL
                var lastChild = this.jQueryElement.children().last();
                this.unregisterLastNumber();
                lastChild.remove();


                //this.lastX -= this.distance;
            }
        },
        /**
         * Executes the transformation given by the transform object.
         * @param {Object} tm Transform object
         * @private
         * @returns {undefined}
         */
        executeTransform: function (x) {
            var el = this.element;

            if (x) {
                var value = [
                    'translate3d(' + x + 'px, 0, 0)'
                ];
                value = value.join(" ");
                el.style.webkitTransform = value;
                el.style.mozTransform = value;
                el.style.transform = value;

            }

        },
        /**
         * Iterates over the wheel.
         * @private
         * @param {function} cb Function to be applied on all elements of the wheel.
         * @returns {undefined}
         */
        iterateWheel: function (cb) {
            var w = this.wheel;
            var l = w.length;

            for (var i = 0; i < l; i++) {
                cb.call(this, w[i]);
            }
        },
        /**
         * This method calculates the real array index (circular) given a linear
         * index.
         * @param {number} i Index
         * @private
         * @returns {undefined}
         */
        realIndex: function (i) {
            var o = this.numbers.length;
            var dir = i < 0 ? false : true;
            var realdistance = Math.abs(i);
            var offset = realdistance % o;

            if (realdistance < o) {
                offset = realdistance;
            }
            if (dir) {
                return offset;
            } else {
                return o - offset;
            }

            return i;
        }
    };


    //FACTORY's FINAL OBJECT
    return Canvas;
});

