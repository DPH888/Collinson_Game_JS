// vsichko ostanalo
let myX, myY, start = false, trevaX = [], trevaY = [], skacham = false, timer = 0, broqch = 0, ubitiVragove = 0, wena = femaleAction, muw = heroHello, daliMuw = false, daliWena = false;
let dy = 0, dySkorost = 0.5;
let lineX = 0;
let lineY = 0;
let line_angle = 0;
let vragX = [], vragY = [], brVrag = 50, vragRadius = 25;
let lineLenght = 120;
let Jump_Sound = new Audio('Jump.wav');
Jump_Sound.volume = 0.1;
Jump_Sound.playbackRate = 1.1;
let Fall_Sound = new Audio('fall.wav');
Fall_Sound.volume = 0.1;
let angle = Math.atan2(mouseY - lineY - 30, mouseX - lineX);
let nachalnaSkorost1 = 50, nachalnaSkorost2 = 120, krajnaSkorost1 = 10, krajnaSkorost2 = 50;
let izbral = false, animaciq = -100, animaciq2 = -100, alarma = -400, zadejstvaj = false,pobedili=false,pobedaAnimaciq=-150;
let brKonfeti=300, KonfetiX=[],konfetiY=[];
for (let k=0;k<brKonfeti;k++){
    KonfetiX[k] = randomInteger(0,1500)
    konfetiY[k] = randomInteger(-30, -1000)
}
for (let i = 0; i < 10000; i = i + 1) {
    trevaX[i] = i * 255
    trevaY[i] = 680
}
for (let p = 0; p < brVrag; p++) {
    vragX[p] = randomInteger(-20000, 21000)
    vragY[p] = randomInteger(0, -10000)
}
function checkCollisionWithLine(x, y, vragRadius, lineX, lineY, angle, lineLenght) {
    var kx = Math.cos(angle) * lineLenght;
    var ky = Math.sin(angle) * lineLenght;
    var cx = x - lineX;
    var cy = y - lineY;
    var projection = (cx * kx + cy * ky) / lineLenght;
    var distance = Math.sqrt(cx * cx + cy * cy - projection * projection);
    if (distance <= vragRadius && projection >= 0 && projection <= lineLenght) {
        return true;
    }
    return false;
}

function init() {
    // Kodut tuk se izpulnqva vednuj v nachaloto
    myX = 100;
    myY = 620;
}

function update() {
    for (let k=0;k<brKonfeti;k++){
    if(pobedili==true){
        konfetiY[k]++
    }
}
    // console.log(vragX[0], vragY[0], vragRadius, lineX, lineY, angle, lineLenght + 35)
    angle = Math.atan2(mouseY - lineY, mouseX - lineX);
    for (let p = 0; p < brVrag; p++) {
        //  console.log(checkCollisionWithLine(vragX[p]+25, vragY[p]+25, vragRadius, lineX, lineY, angle,lineLenght+25))
    }
    for (let p = 0; p < brVrag; p++) {
        if (checkCollisionWithLine(vragX[p] + 25, vragY[p] + 25, vragRadius, lineX, lineY, angle, lineLenght + 25) == true) {
            ubitiVragove++
            vragX[p] = 80000000
        }
    }
    if (start == true) {
        broqch++;
    }
    lineY = myY +15
    lineX = myX+25
    //  console.log(timer, skacham,dy)
    dy = dy + dySkorost
    myY = myY + dy
    //Math.round(dy)
    if (myY >= 620) {
        myY = 620
        dy = 0
    }
    if (timer >= 11) {
        Fall_Sound.play()
    }
    if (myY >= 60 && skacham == true && dy >= 3) {
        timer++
    }

    if (dy == 0) {
        timer = 0
    }
    if (myX <= 0) {
        myX = 1
    }
    if (isKeyPressed[68]) {
        myX = myX + 10
    }
    if (isKeyPressed[65]) {
        myX = myX - 10
    }
    if (skacham == false) {
        if (isKeyPressed[32]) {
            dySkorost = 1
            dy = -15
            skacham = true
            Jump_Sound.play()
        }
    }
    for (let i = 0; i < 10000; i = i + 1) {
        if (areColliding(myX, myY, 1, 80, trevaX[i] - 1000, trevaY[i] + 15, 255, 45)) {
            skacham = false
        }
    }
    if (broqch >= 20) {
        for (let p = 0; p < brVrag; p++) {
            if (!areColliding(myX, myY, 80, 60, vragX[p], vragY[p], vragRadius * 10, vragRadius * 10)) {
                vragX[p] = vragX[p] + (myX - vragX[p]) / randomInteger(nachalnaSkorost1, nachalnaSkorost2);
                vragY[p] = vragY[p] + (myY - vragY[p]) / randomInteger(nachalnaSkorost1, nachalnaSkorost2);
            } else {
                vragX[p] = vragX[p] + (myX - vragX[p]) / randomInteger(krajnaSkorost1, krajnaSkorost2);
                vragY[p] = vragY[p] + (myY - vragY[p]) / randomInteger(krajnaSkorost1, krajnaSkorost2);
            }
        }
    }
    for (let p = 0; p < brVrag; p++) {
        if (areColliding(myX+30, myY+40, 80, 60, vragX[p]+20, vragY[p]+20, vragRadius * 2, vragRadius * 2)) {
            while (1) { }
        }
    }
    if (izbral == true) {
        if (start == false) {
            if (daliMuw == true) {
                animaciq++
            }
        }
    }
    if (izbral == true) {
        if (start == false) {
            if (daliWena == true) {
                animaciq2++
            }
        }
    }

    if (izbral == false) {
        if (zadejstvaj == true) {
            alarma++;
        }
    }
    if(start==true){
        if(pobedili==true){
pobedaAnimaciq=pobedaAnimaciq+randomInteger(1, 5);
        }
        }
        if(ubitiVragove>=50){
            pobedili=true
        }
}
function generateRandomColor() {
    var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
    //random color will be freshly served
}
function draw() {
    if (start == true) {
        for (let i = 0; i < 10000; i = i + 1) {
            drawImage(arrowLeft, trevaX[i] - 1000, trevaY[i], 255, 45);
        }
    }
    // drawImage(femaleAction, myX , myY, 60, 80);
    if (start == false) {
        drawImage(back3D, 0, 0, 8000, 60000)
        if (mouseX >= (canvas.width / 2) - 100 && mouseX <= (canvas.width / 2) + 30 && mouseY >= (canvas.height / 2) - 100 && mouseY <= (canvas.height / 2) - 45) {
            context.fillStyle = generateRandomColor();
        }
        context.font = '60px Arial';
        context.fillText("Start", (canvas.width / 2) - 100, (canvas.height / 2) - 100);
    }
    if (start == true) {
        //context.save(); 
        //context.translate(lineX + 30, lineY + 5); 
        angle = Math.atan2(mouseY - lineY, mouseX - lineX);
        //context.rotate(angle+Math.PI/2)
        drawLine(lineX, lineY, lineX + Math.cos(angle) * lineLenght, lineY + Math.sin(angle) * lineLenght)
        //context.restore();
    }
    if (start == true) {
        if (daliWena == true) {
            drawImage(wena, myX, myY, 60, 80);
        }
        if (daliMuw == true) {
            drawImage(muw, myX, myY, 60, 80);
        }
        for (let p = 0; p < brVrag; p++) {
            drawImage(ballOrTree, vragX[p], vragY[p], vragRadius * 2, vragRadius * 2)
        }
        context.fillStyle = 'Black';
        context.font = '50px Arial';
        context.fillText(ubitiVragove, 1410, 10);
    }
    if (izbral == true) {
        if (start == false) {
            if (daliMuw == true) {
                context.fillStyle = 'Black';
                context.font = '20px Arial';
                context.fillText("You are man", animaciq, 10);
            }
        }
    }
    if (izbral == true) {
        if (start == false) {
            if (daliWena == true) {
                context.fillStyle = 'Black';
                context.font = '20px Arial';
                context.fillText("you are woman", animaciq2, 10);
            }
        }
    }
    if (izbral == false) {
        if (zadejstvaj == true) {
            context.fillStyle = 'Black';
            context.font = '20px Arial';
            context.fillText("Choose betwen 1 for woman and 2 for man", alarma, 10);
        }
    }
    for (let k=0;k<brKonfeti;k++){
        drawImage(arrowDownLeft,KonfetiX[k],konfetiY[k],30,30)
    }
    if(start==true){
        if(pobedili==true){
            context.fillStyle = 'Black';
            context.font = '40px Arial';
            context.fillText("YOU WIN!", pobedaAnimaciq, 300);  
        }
    }
}
function mouseup() {
    // Pri klik s lqv buton - pokaji koordinatite na mishkata
    console.log("Mouse clicked at", mouseX, mouseY);
    if (areColliding((canvas.width / 2) - 100, (canvas.height / 2) - 100, 130, 55, mouseX, mouseY, 1, 1)) {
        start = true
    }
    if (izbral == false) {
        start = false
        zadejstvaj = true
    }
}

function keyup(key) {
    console.log("Pressed", key);
    // Pechatai koda na natisnatiq klavish
    if (start == false && izbral == false) {
        if (key == 49) {
            daliWena = true
            izbral = true
        }
    }
    if (start == false && izbral == false) {
        if (key == 50) {
            daliMuw = true
            izbral = true
        }
    }
}
function mouseMove(e) {
    if (cursor) {
        if (e.myX && e.myY) {
            cursorBoundingline(e.myX, e.myY);
        }
    }
}