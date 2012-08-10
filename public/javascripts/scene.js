Scene = function(){
    this.objects = new Array()
}
Scene.prototype.step = function(fn,deltaT,redraw){
    for(var i = 0; i < this.objects.length;i++){
        if(fn) fn(this.objects[i])
        this.objects[i].step(null,deltaT,false)
    }
    if(redraw) this.redraw()
    return this
}
Scene.prototype.redraw = function(){
    // TODO: use a `dirt` variable to keep track if a redraw is even needed
    this.each(function(obj){ obj.redraw() })
}

Scene.prototype.gravity = function(g){
    // gravity
    var f_mag, f_vec, self = this
    this.pairs(function(obj1,obj2){
        f_mag = obj1.getGForce(obj2,g)
        try{ f_vec = obj1.pos.lookAt(obj2.pos).normalize() } catch(e) { return }
        if(obj2.pos.minus(obj1.pos).magnitude() > obj2.radius + obj1.radius){
            obj1.applyForce(f_vec.scale(f_mag))
            obj2.applyForce(f_vec.scale(-f_mag))
        }
    })
}

Scene.prototype.collision = function(k,fn){
    var diff, dir, f
    this.pairs(function(obj1,obj2){
        diff = obj2.pos.minus(obj1.pos)
        try{ dir = diff.normalize() } catch(e) { return }
        var dif_mag = diff.magnitude()
        if(dif_mag < obj2.radius + obj1.radius){
            var x = obj2.radius + obj1.radius - dif_mag
            f = k*x
            obj1.applyForce(dir.scale(-f))
            obj2.applyForce(dir.scale(f))
            if(fn) fn(obj1,obj2)
        }
    })
}

Scene.prototype.dampen = function(d){
    for(var i = 0; i < this.objects.length;i++)
        this.objects[i].dampen(d)
}

Scene.prototype.pairs = function(fn){
    for(var i = 0; i < this.objects.length;i++){
        this.objects[i]
        for(var j = i; j < this.objects.length;j++){
            if(i===j) continue
            fn(this.objects[i],this.objects[j])
        }
    }
}
Scene.prototype.each = function(fn){
    for(var i = 0; i < this.objects.length;i++)
        fn(this.objects[i])
}

Scene.prototype.add = function(obj){
    this.objects.push(obj)
    return obj
}

Scene.CreateBall = function(opts){
    var el = document.createElement("div")
    el.className = "ball"
    if(opts.color) el.style.backgroundColor = opts.color
    document.body.appendChild(el)
    return (new InteractiveObject(opts)).attachElement(el,function(){
        this.mass = 1
        el.style.borderRadius = this.radius + 'px'
        el.style.width = this.radius * 2 + 'px'
        el.style.height = this.radius * 2 + 'px'
        el.style.boxShadow = '0px 0px 20px 0px #000'
    })
    .listenForMouseEvents('mouseup','mousemove','mousedown')
    .on('mousedown',function(event){
        var self = this
        document.addEventListener('mousemove',mousemove)
        var prev_pos = this.pos.copy()
        var prev_vel = this.vel.copy()
        var prev_fixed = this.fixed
        mousemove(event)
        
        function mousemove(event){
            self.acc.x = prev_vel.x - self.vel.x
            self.acc.y = prev_vel.y - self.vel.y
            prev_vel.x = self.vel.x = self.pos.x - prev_pos.x
            prev_vel.y = self.vel.y = self.pos.y - prev_pos.y
            prev_pos.x = self.pos.x = event.clientX
            prev_pos.y = self.pos.y = event.clientY
            self.fixed = true
        }
        document.addEventListener('mouseup',function(event){
            document.removeEventListener('mousemove',mousemove)
            self.fixed = prev_fixed
        })
    })
}

if(typeof(module)!=='undefined') module.exports = Scene