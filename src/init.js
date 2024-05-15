import { engine } from "./engine.mjs";
import { game } from "./game.mjs"
import { initGlobalImages } from "./asset_loading/asset_loader2d.mjs";
import { loadLiminalTextureLib } from "./asset_loading/assets_3d.mjs";
import { initSounds } from "./asset_loading/asset_loader_sounds.mjs";
    
document.body.onload = () => {
    console.log("Front end scripts starting.");

    // Init sound for game
    initSounds();

    // 2d canvas image loading (from code.zip)
    initGlobalImages();

    // 3d assets loading (materials)
    loadLiminalTextureLib();
    
    // initGLobalSounds();

    engine.init();

    game.init();
};