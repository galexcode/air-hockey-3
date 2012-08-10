
function InteractiveObject(){
    // call super constructor
    MovingObject.apply(this,arguments)
    EventEmitter.apply(this)
}
InteractiveObject.prototype.listenForMouseEvents = function(){
    var self = this
        , args = Array.prototype.slice.call(arguments)
    for(i in args){
        (function(){
            var eventname = args[i]
            var eventcb = '__on' + eventname
            if(!Object.prototype.hasOwnProperty.call(self,eventcb)){
                self[eventcb] = function(event){ this.emit(eventname,event) }
                self.el.addEventListener(eventname,function(e){ 
                    self[eventcb](e)
                })
            }
        })()
    }
    return this
}

// extend MovingObject
InteractiveObject.prototype.__proto__ = MovingObject.prototype

// extend EventEmitter
var keys = Object.keys(EventEmitter.prototype)
for(var i = 0; i < keys.length;i++){
    var key = keys[i]
    InteractiveObject.prototype.__proto__[key] = EventEmitter.prototype[key]
}