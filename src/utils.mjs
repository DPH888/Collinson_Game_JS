function areColliding(Ax, Ay, Awidth, Aheight, Bx, By, Bwidth, Bheight) {
    if (Bx <= Ax + Awidth) {
        if (Ax <= Bx + Bwidth) {
            if (By <= Ay + Aheight) {
                if (Ay <= By + Bheight) {
                    return 1;
                }
            }
        }
    }
    return 0;
};

function randomInteger(upTo) {
    return Math.floor(Math.random() * upTo);
}

function drawLine(startX, startY, endX, endY) {
    // For better performance bunch calls to lineTo without beginPath() and stroke() inbetween.
    engine.context2d.beginPath(); // resets the current path
    engine.context2d.moveTo(startX, startY);
    engine.context2d.lineTo(endX, endY);
    engine.context2d.stroke();
}
function drawImage(myImageObject, x, y, xs, ys) {
    myImageObject.draw(x, y, xs, ys);
}

function isFunction(f) {
    return typeof (f) == "function";
}

function createButton(text,x,y,w,h,buttonCol,fontsize,textCol, font = "Arial"){
    //Create background
    engine.context2d.fillStyle = buttonCol;
    engine.context2d.fillRect(x,y,w,h);
    //Create text
    engine.context2d.fillStyle = textCol;
    engine.context2d.font = fontsize + "px " + font;
    //i do not know why this works, it but it just does
    engine.context2d.fillText(text,x + w/2 - (text.length*fontsize)/4, y + h/2 + fontsize/3); 
}
export {areColliding, randomInteger, drawLine, drawImage, isFunction, createButton};