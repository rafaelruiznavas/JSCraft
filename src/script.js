// AUDIO
let musicBG = new Audio()
musicBG.src = 'sounds/music01.mp3'
musicBG.volume = 0.2

noise.seed(Math.random())
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.lookAt (new THREE.Vector3(1,0,1));
const controls = new THREE.PointerLockControls(camera, document.body)
document.body.addEventListener("click", () =>{
    controls.lock()
})
controls.addEventListener('lock', ()=>{})
controls.addEventListener('unlock', ()=>{})

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()    
})

let autoJump = false
const toggleAutoJump = () =>{
    autoJump = !autoJump
    document.getElementById("autojumpBtn").innerHTML = autoJump ? "AUTOJUMP ON" : "AUTOJUMP OFF"
}

let musicPlay = false
const toggleMusic = () => {
    musicPlay = !musicPlay
    musicPlay ? musicBG.play() : musicBG.pause()
    document.getElementById("musicBtn").innerHTML = musicPlay ? "MUSIC ON" : "MUSIC OFF"
}

const loader = new THREE.TextureLoader()
const materialArray = [
    new THREE.MeshBasicMaterial({map: loader.load('images/side.png')}),
    new THREE.MeshBasicMaterial({map: loader.load('images/side.png')}),
    new THREE.MeshBasicMaterial({map: loader.load('images/top.png')}),
    new THREE.MeshBasicMaterial({map: loader.load('images/bottom.png')}),
    new THREE.MeshBasicMaterial({map: loader.load('images/side.png')}),    
    new THREE.MeshBasicMaterial({map: loader.load('images/side.png')}),
    
]

class Block {
    constructor(x,y,z){
        this.x = x
        this.y = y
        this.z = z
    }

    display = () => {
        const blockBox = new THREE.BoxBufferGeometry(5, 5, 5)
        //const blockMesh = new THREE.MeshBasicMaterial({color: 0x000000})
        const block = new THREE.Mesh(blockBox, materialArray)
        scene.add(block)
        block.position.x = this.x
        block.position.y = this.y-10
        block.position.z = this.z

        const edges = new THREE.EdgesGeometry(blockBox)
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000, linewidth:1}))
        scene.add(line)
        line.position.x = this.x
        line.position.y = this.y-10
        line.position.z = this.z
    }
}

//const axesHelper = new THREE.AxesHelper(5)
//scene.add(axesHelper )

let blocks = []
const amplitude = 50
const inc = 0.05
let xoff = 0
let zoff = 0
for(let x=0;x<20;x++){
    xoff = 0
    for(let z=0;z<20;z++){
        let v = Math.round(noise.perlin2(xoff, zoff) * amplitude / 5) * 5
        blocks.push(new Block(x*5, v, z * 5))
        xoff = xoff + inc
    }
    zoff = zoff + inc
}
blocks.forEach((b) =>{
    b.display()
})

// Comprobamos que tecla se ha pulsado
var keys = []
var canJump = true
document.addEventListener("keydown", (e) => {
    keys.push(e.key)
    if(e.key == " " && canJump == true){
        canJump = false
        ySpeed = -2
    }
})
document.addEventListener("keyup",(e) => {
    var newArr = []
    keys.forEach((k)=>{
        if(k !== e.key){
            newArr.push(k)
        }
    })
    keys = newArr
})

const movingSpeed = 0.75
let ySpeed = 0
const acc = 0.1
const update = () => {
    if(keys.includes("w")){
        controls.moveForward(movingSpeed)
        if(!autoJump){
            blocks.forEach((b)=> {
                if(camera.position.x <= b.x  + 2.5 &&
                    camera.position.x >= b.x - 2.5 &&
                    camera.position.z <= b.z + 2.5 &&
                    camera.position.z >= b.z - 2.5){
                        if(camera.position.y == b.y - 2.5){
                            controls.moveForward(-1 * movingSpeed)
                        }
                    }
            })
        }
    }
    if(keys.includes("a")){
        controls.moveRight(-1 * movingSpeed)
        if(!autoJump){
            blocks.forEach((b)=> {
                if(camera.position.x <= b.x  + 2.5 &&
                    camera.position.x >= b.x - 2.5 &&
                    camera.position.z <= b.z + 2.5 &&
                    camera.position.z >= b.z - 2.5){
                        if(camera.position.y == b.y - 2.5){
                            controls.moveRight(movingSpeed)
                        }
                    }
            })
        }
    }
    if(keys.includes("s")){
        controls.moveForward(-1 *movingSpeed)
        if(!autoJump){
            blocks.forEach((b)=> {
                if(camera.position.x <= b.x  + 2.5 &&
                    camera.position.x >= b.x - 2.5 &&
                    camera.position.z <= b.z + 2.5 &&
                    camera.position.z >= b.z - 2.5){
                        if(camera.position.y == b.y - 2.5){
                            controls.moveForward(movingSpeed)
                        }
                    }
            })
        }
    }
    if(keys.includes("d")){
        controls.moveRight(movingSpeed)
        if(!autoJump){
            blocks.forEach((b)=> {
                if(camera.position.x <= b.x  + 2.5 &&
                    camera.position.x >= b.x - 2.5 &&
                    camera.position.z <= b.z + 2.5 &&
                    camera.position.z >= b.z - 2.5){
                        if(camera.position.y == b.y - 2.5){
                            controls.moveRight(-1 * movingSpeed)
                        }
                    }
            })
        }
    }
    camera.position.y = camera.position.y - ySpeed;
    ySpeed = ySpeed + acc
    blocks.forEach((b)=> {
        if(camera.position.x <= b.x  + 2.5 &&
            camera.position.x >= b.x - 2.5 &&
            camera.position.z <= b.z + 2.5 &&
            camera.position.z >= b.z - 2.5){
                if(camera.position.y <= b.y + 2.5 && camera.position.y >= b.y - 2.5){
                    camera.position.y = b.y + 2.5
                    canJump = true
                    ySpeed = 0
                    return
                }
            }
    })
}

const render = () => {
    renderer.render(scene, camera)
}

const GameLoop = () => {
    requestAnimationFrame(GameLoop)
    update()
    render()
}

GameLoop()