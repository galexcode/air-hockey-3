function Vector(x,y){
    if(x instanceof Array){
        this.x = x[0]
        this.y = x[1]
    }else if(typeof(x)==='object'){
        this.x = x.x
        this.y = x.y
    }else{
        this.x = x
        this.y = y
    }
}

Vector.prototype.copy = function(){
    return new Vector(this.x,this.y)
}

Vector.prototype.slop = function(vector){
    return this.y / this.x
}

Vector.prototype.dot = function(vector){
    return this.x * vector.x + this.y * vector.y
}

Vector.prototype.cross = function(vector){
    return this.x * vector.y - this.y * vector.x
}

Vector.prototype.plus = function(vector){
    return new Vector(this.x + vector.x, this.y + vector.y)
}

Vector.prototype.minus = function(vector){
    return new Vector(this.x - vector.x, this.y - vector.y)
}

Vector.prototype.normalize = function(){
    var mag = this.magnitude()
    if(mag>0) return new Vector(this.x / mag, this.y / mag)
    throw new Error("normalize failed. mag = zero")
}

Vector.prototype.magnitude = function(){
    return Math.sqrt( this.x * this.x + this.y * this.y )
}

Vector.prototype.scale = function(scale){
    return new Vector(this.x * scale , this.y * scale)
}
Vector.prototype.reverse = function(){
    return this.scale(-1)
}
Vector.prototype.lookAt = function(vector){
    return vector.minus(this).normalize()
}
Vector.prototype.toString = function(){
    return "vector: x: " + this.x + " y: "+ this.y
}
Vector.prototype.toJSON = function(){
    return { x : this.x , y : this.y }
}

if(typeof(module)!=='undefined') module.exports = Vector