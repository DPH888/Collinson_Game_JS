import { engine } from "./engine.mjs";
import { createButton } from "./utils.mjs";
import { playMusic } from "./Sounds.mjs";
import { areColliding } from "./utils.mjs";

function initMenu(onPlayButtonCB) {
    let menu = new Menu();
    // Set custom draw function
    engine.draw2d = (() => {
        engine.context2d.clearRect(0, 0, engine.canvas2d.width, engine.canvas2d.height);
        engine.context2d.strokeRect(0, 0, canvas2d.width, canvas2d.height);
        menu.draw()
    });
    engine.onmouseup = ((e) => {
        let mouseX = e.clientX;
        let mouseY = e.clientY;
        console.log(e, mouseX, mouseY)
        if (!menuConfig.gameStarted) {
            if (areColliding(mouseX, mouseY, 1, 1, 275, 200, 250, 100)) { //Play
                //initGame();
                onPlayButtonCB();
                menu.startSimulation();
            }
            if (areColliding(mouseX, mouseY, 1, 1, 175, 475, 200, 75)) { //Music
                menu.toggleMusic()
            }
            if (areColliding(mouseX, mouseY, 1, 1, 425, 475, 200, 75)) { //Sfx
                menu.toggleSfx()
            }
        }
    })
    return menu;
}

class Menu {
    constructor(){
    }
    draw(){
        //play button
        createButton("Play",275,175,250,100,"red",50,"white");
        //skins button - no functionality
        createButton("Skins",275,300,250,100,"red",50,"white");
        //music toggle button - should be replaced with icon
        if(menuConfig.musicEnabled){
            createButton("Toggle music",175,475,200,75,"red",30,"white");
        }else{
            createButton("Toggle music",175,475,200,75,"grey",30,"white");
        }
        //SFX toggle button - should be replaced with icon
        if(menuConfig.sfxEnabled){
            createButton("Toggle SFX",425,475,200,75,"red",30,"white");
        }else{
            createButton("Toggle SFX",425,475,200,75,"grey",30,"white");
        }
    }
    startSimulation(){
        engine.context2d.globalAlpha = 0;
        menuConfig.gameStarted = true;
        if(menuConfig.musicEnabled){ //there is no pause menu so this should work for now
            playMusic();
        }
    }
    toggleMusic(){
        menuConfig.musicEnabled = !menuConfig.musicEnabled
    }
    toggleSfx(){
        menuConfig.sfxEnabled = !menuConfig.sfxEnabled
    }
}

let menuConfig = {
    gameStarted: false,
    musicEnabled: true,
    sfxEnabled: true,
    showMenu: true
}
export { Menu, initMenu, menuConfig };
