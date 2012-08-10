Color = function(){
    
}

Color.RandomColor = function(){
    function randomHex(){
        var num = (Math.round(Math.random()*255)).toString(16)
        if(num.length===1) num = '0' + num
        return num
    }
    return '#' + randomHex() + randomHex() + randomHex()
}


if(typeof(module)!=='undefined') module.exports = Color