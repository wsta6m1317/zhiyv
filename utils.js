/*common*/

const PI = Math.PI, PI2 = PI * 2;
const bl = BABYLON


/*mesh*/

function CreateBox(...ops) {
    return BABYLON.MeshBuilder.CreateBox(...ops);
}

function CreateSphere(...ops) {
    return BABYLON.MeshBuilder.CreateSphere(...ops);
}

function CreatePlane(...ops) {
    return BABYLON.MeshBuilder.CreatePlane(...ops);
}

function CreateGround(...ops) {
    return BABYLON.MeshBuilder.CreateGround(...ops)
}

function CreateLines(...ops) {
    return BABYLON.MeshBuilder.CreateLines(...ops)
}

function CreateDashedLines(...ops) {
    ops[1].dashSize = 1
    ops[1].gapSize = 1 //间隔的大小
    return BABYLON.MeshBuilder.CreateDashedLines(...ops)
}


/*color*/
function Color3(...ops) {
    if (ops.length === 3) {
        return new BABYLON.Color3(...ops)
    } else {
        return Colors3(ops[0])
    }

}


function Colors3(num) {
    return new Array(num).fill(1).map(d => {
        return Color3(...[...((100 + ~~(Math.random() * 900)) + '')].map(d => d / 10))
    })
}

const c3 = Color3

function Color4(...ops) {
    if (ops.length === 4) {
        return new BABYLON.Color4(...ops)
    } else {
        return Colors4(ops[0])
    }
}

function Colors4(num) {
    return new Array(num).fill(1).map(d => {
        return Color4(...[...((1000 + ~~(Math.random() * 9000)) + '')].map(d => d / 10))
    })
}

const c4 = Color4

/*vector*/
function Vec3(...ops) {
    if (ops.length > 3) {
        let result = []
        for (let i = 0; i < ops.length; i += 3) {
            result.push(new BABYLON.Vector3(...ops.slice(i, i + 3)))
        }
        return result
    } else {
        return new BABYLON.Vector3(...ops)
    }
}

function Vec4(...ops) {
    return new BABYLON.Vector4(...ops)
}


/*material*/
function StandardMaterial(name, ops, scene) {
    let material = new BABYLON.StandardMaterial(name, scene);
    Object.entries(ops).forEach(d => {
        material[d[0]] = d[1]
    })
    return material
}


/*texture*/
function Texture(url, scene) {
    if (url) {
        url = `../img/${url}`
    } else {
        url = '../img/tongp.png'
    }
    return new BABYLON.Texture(url, scene);
}


/*frameAnimation*/
function frameAnimation(name, target, fps, type, loop, keys) {
    let animation = new BABYLON.Animation(
        name, target, fps, type, loop
    );
    animation.setKeys(keys);
    return animation
}


/*showAxis*/


function showAxis(size, scene, type = 0) {
    let d0 = size * 0.98, d1 = size * 0.01
    let create = type == 1 ? CreateLines : CreateDashedLines;
    let axisX = create("axisX", {
        points: [
            Vec3(0, 0, 0), Vec3(size, 0, 0), Vec3(d0, d1, 0),
            Vec3(size, 0, 0), Vec3(d0, -d1, 0)
        ]
    }, scene);
    axisX.color = Color3(1, 0, 0);
    let axisY = create("axisY", {
        points: [
            Vec3(0, 0, 0), Vec3(0, size, 0), Vec3(-d1, d0, 0),
            Vec3(0, size, 0), Vec3(d1, d0, 0)
        ]
    }, scene);
    axisY.color = Color3(0, 1, 0);
    let axisZ = create("axisZ", {
        points: [
            Vec3(0, 0, 0), Vec3(0, 0, size), Vec3(0, -d1, d0),
            Vec3(0, 0, size), Vec3(0, d1, d0)
        ]
    }, scene);
    axisZ.color = Color3(0, 0, 1);
}


function localAxes(self, size, scene, type = 1) {
    let d0 = size * 0.98, d1 = size * 0.01
    let create = type == 1 ? CreateLines : CreateDashedLines;
    let axisX = create("axisX", {
        points: [
            Vec3(0, 0, 0), Vec3(size, 0, 0), Vec3(d0, d1, 0),
            Vec3(size, 0, 0), Vec3(d0, -d1, 0)
        ]
    }, scene);
    axisX.color = Color3(1, 0, 0);
    let axisY = create("axisY", {
        points: [
            Vec3(0, 0, 0), Vec3(0, size, 0), Vec3(-d1, d0, 0),
            Vec3(0, size, 0), Vec3(d1, d0, 0)
        ]
    }, scene);
    axisY.color = Color3(0, 1, 0);
    let axisZ = create("axisZ", {
        points: [
            Vec3(0, 0, 0), Vec3(0, 0, size), Vec3(0, -d1, d0),
            Vec3(0, 0, size), Vec3(0, d1, d0)
        ]
    }, scene);
    axisZ.color = Color3(0, 0, 1);

    let local_origin = CreateBox("local_origin", {size: size}, scene);
    local_origin.isVisible = false;

    axisX.parent = local_origin;
    axisY.parent = local_origin;
    axisZ.parent = local_origin;

    local_origin.parent = self
    return local_origin;

}


/*点击获取*/
function getPickMesh(callBack) {
    let cbs = []
    return {
        triggerPick: (...args) => {
            cbs.forEach(c => {
                c(...args)
            })
        },
        registerPick: cb => {
            cbs.push(cb)
        },
    }
}

let {registerPick, triggerPick} = getPickMesh()

function quickPick(scene){
    scene.onPointerObservable.add((pointerInfo) => {
        // if (BABYLON.PointerEventTypes.POINTERDOWN === pointerInfo.type) {
            console.log()

            let _ray = pointerInfo.pickInfo.ray
            let ray = new BABYLON.Ray(_ray.origin, _ray.direction, _ray.length);

            let hits = scene.multiPickWithRay(ray);

            if (hits) {
                triggerPick(hits,ray,pointerInfo)
                // console.log(hits)
                // for (var i=0; i<hits.length; i++){
                //     hits[i].pickedMesh.scaling.y += 0.01;
                // }
            }
        // }
    });
}


// GL.scene.onPointerObservable.add((pointerInfo) => {
//     console.log(pointerInfo)
//     // box.position = pointerInfo.pickInfo.ray.origin
//     // switch (pointerInfo.type) {
//     //     case BABYLON.PointerEventTypes.POINTERDOWN:
//     //         console.log("POINTER DOWN");
//     //         break;
//     //     case BABYLON.PointerEventTypes.POINTERUP:
//     //         console.log("POINTER UP");
//     //         break;
//     //     case BABYLON.PointerEventTypes.POINTERMOVE:
//     //         console.log("POINTER MOVE");
//     //         break;
//     //     case BABYLON.PointerEventTypes.POINTERWHEEL:
//     //         console.log("POINTER WHEEL");
//     //         break;
//     //     case BABYLON.PointerEventTypes.POINTERPICK:
//     //         console.log("POINTER PICK");
//     //         break;
//     //     case BABYLON.PointerEventTypes.POINTERTAP:
//     //         console.log("POINTER TAP");
//     //         break;
//     //     case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
//     //         console.log("POINTER DOUBLE-TAP");
//     //         break;
//     // }
// });


function createSky(scene){
    let skybox = CreateBox("TropicalSunnyDay", {size:500}, scene);
    let skyboxMaterial = StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;

    skybox.material = skyboxMaterial;

    //设置天空盒跟随相机
    skybox.infiniteDistance = true;
    //移除天空盒上的光线反射
    skyboxMaterial.disableLighting = true;

    //添加天空盒纹理
    //在该/skybox目录中，我们必须找到6个天空纹理，一个对应于我们盒子的每个面。每个图像必须根据相应的面命名：
    // “skybox_nx.jpg”（左）、
    // “skybox_ny.jpg”（下）、
    // “skybox_nz.jpg”（后）、
    // “skybox_px.jpg”（右）、
    // “skybox_py.jpg”（上）、
    // “skybox_pz.jpg”（前）。
    // “_nx.jpg”将添加到路径中。
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../img/sky/TropicalSunnyDay", GL.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
}
