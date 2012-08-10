$(function() {
    var requestAnimationFrame = 
        window.requestAnimationFrame 
        || window.mozRequestAnimationFrame 
        || window.webkitRequestAnimationFrame 
        || window.msRequestAnimationFrame
    window.requestAnimationFrame = requestAnimationFrame

    var socket = io.connect('http://localhost');
    socket.on('player-set', function (data) {
        console.log('got data')
        console.log(data)
        if(data==="left"){
            side = "left"
        }else if(data==="right"){
            side = "right"
        }else{
            alert('the game is full!')
        }
    });
    
    socket.on('player-leave',function(data){
        console.log('a player left')
        console.log(data)
    })
    socket.on('step',function(data){
        console.log('step from : '+data.side)
    })
    
    
    // measurements are in pixels and milliseconds
    var scene = new Scene()
    
    var w = window.innerWidth
        , h = window.innerHeight
        , malletLeft = null
        , malletRight = null
        , puck = null
        , gravity = new Vector(0,0)
        , deltaT = 0
        , maxDelta = 100
        , k = 0.01
        , timeScale = 1
        , ppcm = 50
        , ppm = ppcm * 100
        , side = null
    
    malletLeft = scene.add(Scene.CreateBall({
        mass : 100000
        , radius : 100
        , fixed : true
    }))
    $(malletLeft.el).addClass('mallet').addClass('blue')
    $(malletLeft.el).append(
        '<div class="inner1">'
            + '<div class="inner2">'
                + '<div class="inner3"></div>'
            + '</div>'
        + '</div>')
    
    puck = scene.add(Scene.CreateBall({
        mass : 100000
        , radius : 100
    }))
    $(puck.el).addClass('puck')
    $(puck.el).append('<div class="puck-inner"></div>')
    
    malletRight = scene.add(Scene.CreateBall({ 
        mass : 100000
        , radius : 100
        , fixed : true
    }))
    $(malletRight.el).addClass('mallet').addClass('red')
    $(malletRight.el).append(
        '<div class="inner1">'
            + '<div class="inner2">'
                + '<div class="inner3"></div>'
            + '</div>'
        + '</div>')
    
    
    function resetBoard(){
        malletLeft.reposition(new Vector(w/8, h/2))
        malletRight.reposition(new Vector(w - w/8, h/2))
        puck.reposition(new Vector(w/2, h/2))
    }
    resetBoard()
    
    var prev = new Date()
        , now = new Date()
        , interval_id = null
    
    function step(){
        now = new Date()
        deltaT = now - prev
        prev = now
        deltaT = deltaT * timeScale
        scene.step(function(){
            scene.collision(k)
            // puck.applyForce(gravity.scale((9.82/ppm) * deltaT))
            constraint(puck, deltaT / timeScale)
        },deltaT).each(function(){
            socket.emit('step',{
                puck : puck
                , left : malletLeft
                , right : malletRight
                , side : side
            })
        })
    }
    interval_id = setInterval(step)
    
    ;(function render(){
        scene.redraw()
        setTimeout(function(){ requestAnimationFrame(render) })
    })()
    
    function constraint(obj,deltaT){
        var x, f, damping = 0.9
        if(obj.pos.x + obj.radius > w){
            // x = obj.pos.x + obj.radius - w
            // f = - x * k
            // obj.applyForce(new Vector(f,0))
            obj.dampen(damping)
            obj.vel.x *= -1
            obj.acc.x *= -1
            obj.pos.x = w - obj.radius
            checkGoal(obj, true)
        }else if(obj.pos.x - obj.radius < 0){
            // x = obj.pos.x - obj.radius
            // f = - x * k
            // obj.applyForce(new Vector(f,0))
            obj.dampen(damping)
            obj.vel.x *= -1
            obj.acc.x *= -1
            obj.pos.x = obj.radius
            checkGoal(obj, false)
        }
        if(obj.pos.y + obj.radius >= h){
            // x = obj.pos.y + obj.radius - h
            // f = - x * k
            // obj.applyForce(new Vector(0,f))
            obj.dampen(damping)
            obj.vel.y *= -1
            obj.acc.y *= -1
            obj.pos.y = h - obj.radius
        }else if(obj.pos.y - obj.radius <= 0){
            // x = obj.pos.y - obj.radius
            // f = - x * k
            // obj.applyForce(new Vector(0,f))
            obj.dampen(damping)
            obj.vel.y *= -1
            obj.acc.y *= -1
            obj.pos.y = obj.radius
        }
    }
    
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation",function(event){
            tilt([event.beta, event.gamma]);
        }, true);
    } else if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', function(event){
            tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
        }, true);
    } else {
        window.addEventListener("MozOrientation", function(){
            tilt([orientation.x * 50, orientation.y * 50]);
        }, true);
    }
    
    function tilt(vec){
        // parts taken from: http://mrdoob.com/projects/chromeexperiments/ball_pool/js/Main.js
        gravity = new Vector(
            Math.sin( event.gamma * Math.PI / 180 )
            , Math.sin( ( Math.PI / 4 ) + event.beta * Math.PI / 180 )
        )
    }
    
    window.addEventListener('resize',function(event){
        w = window.innerWidth
        h = window.innerHeight
        redrawBoard(w,h)
    })
    
    redrawBoard(w,h)
})