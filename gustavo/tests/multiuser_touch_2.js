
        Object.prototype.toDirString = function() {
            var output = [];
            for(var key in this) {
                if(this.hasOwnProperty(key)) {
                    var value = this[key];
                    if(Array.isArray(value)) {
                        value = "Array("+ value.length +"):"+ value;
                    } else if(value instanceof HTMLElement) {
                        value = value +" ("+ value.outerHTML.substring(0, 50) +"...)";
                    }
                    output.push(key +": "+ value);
                }
            }
            return output.join("\n")
        };
        function addHammer(el) {
            var mc = new Hammer(el, { multiUser: true });
            mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
            mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            mc.get('pinch').set({ enable: true });
            mc.get('rotate').set({ enable: true });
            mc.on("swipe pan press pinch rotate tap doubletap", function (ev) {
                ev.preventDefault();
                el.innerText = ev.toDirString();
            });
        }
        addHammer(document.querySelector("#left"));
        addHammer(document.querySelector("#right"));
