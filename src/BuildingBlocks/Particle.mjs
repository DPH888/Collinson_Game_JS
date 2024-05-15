import * as THREE from "three";
import { engine } from "../engine.mjs";

let emitters = [];

//* One singular particle
class Particle {
    constructor(x, y, z, dx, dy, dz, size, color, lifetime) {
        //Transform:
        this.x = x;
        this.y = y;
        this.z = z;

        //delta xyz
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;

        this.size = size;

        //Lifetime:
        this.lifetime = lifetime;
        this.isDead = false;


        //time
        this.t = 0

        //set up as THREE.js object
        this.material = new THREE.SpriteMaterial({color: color})
        this.sprite = new THREE.Sprite(this.material)
        engine.scene.add(this.sprite)
        this.sprite.position.set(this.x, this.y, this.z)
        this.sprite.scale.set(size, size, 1)
    }

    updateParticle() {
        if(!this.isDead) {
            //update values
            this.t++
    
            this.x += this.dx
            this.y += this.dy
            this.z += this.dz
    
            //update THREE.js object pos
            this.sprite.position.set(this.x, this.y, this.z)
    
            //lifetime deletion (lifetime in seconds)
            if(this.t/100 > this.lifetime) {
                this.killParticle()
            }
        }
    }
    
    killParticle() {
        this.isDead = true;
        engine.scene.remove(this.sprite)
        this.material.dispose()
    }
}

//* Emitter AKA Particle system which spawns and controls particles
class Emitter {
    constructor(originX, originY, originZ, type, data, index) {
        //the system will have 2 types of particle emitters - single burst and over time.
        //The type determines what values will be pulled from this.data
        //TODO over-time emitter type

        //Transform:
        this.x = originX;
        this.y = originY;
        this.z = originZ;

        //Misc:
        this.t = 0;
        this.type = type;
        this.data = data;
        this.index = index; //what index this emitter is
        this.isDead = false;

        this.particles = []
    }
    updateEmitter() {
        if(!this.isDead) {

            this.t++;

            for(let particle of this.particles) {
                particle.updateParticle()
            }
    
            if(this.type == "burst") {
                //* Data inside of a burst type emitter:
                //particle_cnt - how many particles to spawn
                //particle_lifetime - an object with min & max
                //power - how fast should the particles fly off
                //fired - whether the emitter already fired a burst
    
                if(!this.data.fired) {
                    //Create particle_cnt particles
                    for(let p_cnt=0; p_cnt<this.data.particle_cnt; p_cnt++) {
                        let _lft = null;
                        _lft = random_range(this.data.particle_lifetime.min, this.data.particle_lifetime.max)
                        
                        this.particles.push(new Particle(
                            this.x, this.y, this.z,
                            (Math.random() - 0.5) * 2 * this.data.power,
                            (Math.random() - 0.5) * 2 * this.data.power,
                            (Math.random() - 0.5) * 2 * this.data.power,
                            // Particle color
                            2, 0x013220, _lft
                        ))
                    }
                    this.data.fired = true;
                }
            }
    
            //delete emitter if no particles exist
            if(this.particles.length == 0) {
                this.killEmitter();
            }
        }


    }
    killEmitter() {
        for(let particle of this.particles) {
            particle.killParticle();
        }
        this.isDead = true;
        emitters.splice(this.index, 1);
    }
}

function updateEmitters() {
    emitters.forEach((em, i) => {
        em.updateEmitter()
    })
}

function createNewEmitter(originX, originY, originZ, type, data) {
    emitters.push(new Emitter(originX, originY, originZ, type, data, emitters.length))
}

function random_range(min, max) {
    return (Math.random() * (max - min + 1)) + min;
}

export{Particle, Emitter, updateEmitters, createNewEmitter}