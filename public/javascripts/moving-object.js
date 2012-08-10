MovingObject = function(opts){
    if(opts && opts.pos) this.pos = new Vector(opts.pos.x,opts.pos.y)
    else this.pos = new Vector(0,0)
    if(opts && opts.vel) this.vel = new Vector(opts.vel.x,opts.vel.y)
    else this.vel = new Vector(0,0)
    if(opts && opts.acc) obj.acc = new Vector(opts.acc.x,opts.acc.y)
    else this.acc = new Vector(0,0)
    if(opts && opts.mass) this.mass = opts.mass
    else this.mass = 1
    if(opts && opts.fixed!==null && opts.fixed!==undefined) 
        this.fixed = (!!opts.fixed)
    else this.fixed = false
    if(opts.radius) this.radius = opts.radius
    else if(opts.mass) this.radius = Math.sqrt( this.mass / Math.PI )
}

MovingObject.prototype.redraw = function(){
    this.defaultRedraw()
}

MovingObject.prototype.reposition = function(vector,maintainVel,maintainAcc){
    this.pos = vector
    if(!maintainVel) this.vel = new Vector(0,0)
    if(!maintainAcc) this.acc = new Vector(0,0)
}

MovingObject.prototype.defaultRedraw = function(){
    if(this.el){
        this.el.style.left = (this.pos.x - this.width/2) + 'px'
        this.el.style.top = (this.pos.y - this.height/2) + 'px'
    }
}

MovingObject.prototype.attachElement = function(element,fn){
    this.el = element
    if(fn) fn.call(this)
    if(this.el){
        this.width = this.el.offsetWidth
        this.height = this.el.offsetHeight
    }
    return this
}

MovingObject.prototype.dampen = function(factor){
    this.vel = this.vel.scale(factor)
}

MovingObject.prototype.applyForce = function(force){
    this.acc.x += force.x / this.mass
    this.acc.y += force.y / this.mass
}
MovingObject.prototype.step = function(fn,deltaT,redraw){
    if(!this.fixed){
        this.vel.x += this.acc.x * deltaT
        this.vel.y += this.acc.y * deltaT
        this.pos.x += this.vel.x * deltaT
        this.pos.y += this.vel.y * deltaT
    }
    if(fn) fn(); else if(redraw) this.redraw()
    this.acc.x = 0
    this.acc.y = 0
}
MovingObject.prototype.getGForce = function(obj,g){
    if(this.pos.x === obj.pos.x && this.pos.y === obj.pos.y ) return 0
    var r_sq = ( obj.pos.x - this.pos.x ) * ( obj.pos.x - this.pos.x) 
        + ( obj.pos.y - this.pos.y ) * ( obj.pos.y - this.pos.y )
    // apply a min threashold based on the radius of when to apply
    // the force of gravity
    if(r_sq <= 10) return 0
    return g * ( this.mass * obj.mass ) / r_sq
}

MovingObject.prototype.toJSON = function(){
    return {
        pos : this.pos
        , vel : this.vel
        , acc : this.acc
    }
}

if(typeof(module)!=='undefined') module.exports = MovingObject