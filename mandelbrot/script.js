//Reference article: https://www.codingame.com/playgrounds/2358/how-to-plot-the-mandelbrot-set/mandelbrot-set

//Returns the absolute value of the complex number
//That is, its distance to the origin
function abs(c){
    let real = Math.abs(c[0]);
    let imag = Math.abs(c[1]);
    let out = Math.sqrt(real*real + imag*imag);
    return out;
}

//Returns the complex number squared
function pow2c(c){
    let real = c[0];
    let imag = c[1];

    let p1 = real*real;
    let p2 = real*imag;
    let p3 = imag*imag;
    let pow2 = [p1-p3, p2*2];

    return pow2;
}

//Retuns the number of iterations to the corresponding complex number
//If number of iterations surpass MAX_ITER c is bounded by b
function mandelbrot(c) {
    let b = 2;
    let z = [0, 0];
    let n = 0;
    while(abs(z) <= b && n < MAX_ITER){
        let pow2 = pow2c(z);
        z = [pow2[0] + c[0], pow2[1] + c[1]];
        n += 1;
    }
    return n;
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];

}

function drawCanvas(k) {

    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {

            //c = [RE_START + (x / WIDTH) * (RE_END - RE_START),
            //    IM_START + (y / HEIGHT) * (IM_END - IM_START)];
            c = [(RE_START + (x / WIDTH) * (RE_END - RE_START)-(k/1.75))/(k+1),
                (IM_START + (y / HEIGHT) * (IM_END - IM_START)-(k/1.75))/(k+1)];
            let m = mandelbrot(c);

            switch (colorMode){
                case 'colors':     // Colored (uses hsv -> rgb)
                    let hue = Math.floor(360 * m / MAX_ITER)/360
                    let saturation = 1
                    let value = 0
                    if (m < MAX_ITER) value = 1;
                    color = HSVtoRGB(hue, saturation, value)
                    ctx.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
                    break;

                case 'binary':     // Black and white
                default:
                    color = 255 - Math.floor(m * 255 / MAX_ITER);
                    ctx.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';
                    break;
        
            }
            
            ctx.fillRect(x, y, 1, 1);
        }
    }

    if (shouldAnimate){
        return setTimeout(function() {
            if (shouldAnimate) zoom_in();
        }, 10)
    }

}

function zoom_in(){
    ZOOM_LEVEL++;
    drawCanvas(ZOOM_LEVEL);
}

function zoom_out(){
    ZOOM_LEVEL--;
    if (ZOOM_LEVEL < 0) 
        ZOOM_LEVEL = 0;
    drawCanvas(ZOOM_LEVEL);
}

function toggle_pageMode(){
    if (colorMode == 'binary'){
        set_darkMode()
    } else {
        set_lightMode()
    }
    
    drawCanvas(ZOOM_LEVEL);
}

function set_lightMode(){
    var a = document.getElementsByTagName("a");
    var handle = document.getElementById("mode_toggler");

    document.body.classList.remove("dark");
    for(var i = 0; i < a.length; i++)
        a[i].classList.remove("dark-icon");

    handle.classList.remove("fa-sun-o");
    handle.classList.add("fa-moon-o");

    colorMode = 'binary';
}

function set_darkMode(a, handle){
    var a = document.getElementsByTagName("a");
    var handle = document.getElementById("mode_toggler");

    document.body.classList.add("dark");
    for(var i = 0; i < a.length; i++)
        a[i].classList.add("dark-icon");

    handle.classList.remove("fa-moon-o");
    handle.classList.add("fa-sun-o");

    colorMode = 'colors';
}

//Update MAX_ITER bounding between 0 < MAX_ITER < 1000
function update_maxiter() {
    MAX_ITER = document.getElementById('max_iter').value;
    drawCanvas(ZOOM_LEVEL);
}

function playAnimation(){
    update_maxiter();
    shouldAnimate = true;
    drawCanvas(ZOOM_LEVEL);
}

function pauseAnimation(){
    shouldAnimate = false;
}

function reloadAnimation(){
    pauseAnimation();
    set_lightMode();
    ZOOM_LEVEL = 0;
    document.getElementById('max_iter').value = 80;
    update_maxiter();
}


//Canvas configs
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;
var MAX_ITER = 80;

//Plot window
var RE_START = -2;
var RE_END = 1;
var IM_START = -1;
var IM_END = 1;

var ZOOM_LEVEL = 0

// Black and white (binary) or colored (colors)
var colorMode = 'binary';
//var colorMode = 'colors';

var shouldAnimate = false;
drawCanvas(ZOOM_LEVEL);

