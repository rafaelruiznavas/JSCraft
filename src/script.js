noise.seed(Math.random())
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
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

class Block {
    constructor(x,y,z){
        this.x = x
        this.y = y
        this.z = z
    }

    display = () => {
        const blockBox = new THREE.BoxBufferGeometry(5, 5, 5)
        const blockMesh = new THREE.MeshBasicMaterial({color: 0x00ff00})
        const block = new THREE.Mesh(blockBox, blockMesh)
        scene.add(block)
        block.position.x = this.x
        block.position.y = this.y-10
        block.position.z = this.z

        const edges = new THREE.EdgesGeometry(blockBox)
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xff0000}))
        scene.add(line)
        line.position.x = this.x
        line.position.y = this.y-10
        line.position.z = this.z
    }
}

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
for(let i = 0;i<blocks.length;i++){
    blocks[i].display()
}


const update = () => {}

const render = () => {
    renderer.render(scene, camera)
}

const GameLoop = () => {
    requestAnimationFrame(GameLoop)
    update()
    render()
}

GameLoop()