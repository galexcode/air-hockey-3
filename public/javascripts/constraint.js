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
        checkGoal(obj,w,h, true)
    }else if(obj.pos.x - obj.radius < 0){
        // x = obj.pos.x - obj.radius
        // f = - x * k
        // obj.applyForce(new Vector(f,0))
        obj.dampen(damping)
        obj.vel.x *= -1
        obj.acc.x *= -1
        obj.pos.x = obj.radius
        checkGoal(obj,w,h, false)
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


function checkGoal(obj,w,h,isLeft){
    if(obj.pos.y > h / 4 && obj.pos.y < h - h / 4){
        if(isLeft){
            // left scored!
            alert('Left Scored!')
            resetBoard()
        }else{
            // right scored!
            alert('Right Scored!')
            resetBoard()
        }
    }
}

function redrawBoard(w,h){
    var tileSize = 80
    var num_hor = Math.floor(w / tileSize) + 1
        , num_ver = Math.floor(h / tileSize) + 1
        , offset_hor = (w % tileSize) / 2
        , offset_ver = (h % tileSize) / 2
    $('body').css('background-position',offset_hor+'px '+offset_ver+'px')
}