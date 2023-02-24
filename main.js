const componentR = document.querySelector(".component-R")
const componentG = document.querySelector(".component-G")
const componentB = document.querySelector(".component-B")

const componentX = document.querySelector(".component-X")
const componentY = document.querySelector(".component-Y")
const componentZ = document.querySelector(".component-Z")

const componentH = document.querySelector(".component-H")
const componentS = document.querySelector(".component-S")
const componentL = document.querySelector(".component-L")

const labels = document.querySelectorAll("label")
const inputs = document.querySelectorAll("input")

const notification = document.querySelector(".notification")

let currColor = "#fff"

function RGBtoXYZ([R, G, B]) {
    const [var_R, var_G, var_B] = [R, G, B]
        .map((x) => x / 255)
        .map((x) =>
            x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92
        )
        .map((x) => x * 100)

    // Observer. = 2°, Illuminant = D65
    X = var_R * 0.412453 + var_G * 0.35758 + var_B * 0.180423
    Y = var_R * 0.212671 + var_G * 0.71516 + var_B * 0.072169
    Z = var_R * 0.019334 + var_G * 0.119193 + var_B * 0.950227
    return { x: X, y: Y, z: Z }
}

function XYZtoRGB([X, Y, Z]) {
    let var_X = X / 100
    let var_Y = Y / 100
    let var_Z = Z / 100

    let var_R = var_X * 3.2406 + var_Y * -1.5372 + var_Z * -0.4986
    let var_G = var_X * -0.9689 + var_Y * 1.8758 + var_Z * 0.0415
    let var_B = var_X * 0.0557 + var_Y * -0.204 + var_Z * 1.057

    return [var_R, var_G, var_B]
        .map((n) =>
            n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : 12.92 * n
        )
        .map((n) => n * 255)
}

const colorPicker = new iro.ColorPicker("#picker", {
    width: 320,
    color: "#fff",
})

const XYZInput = document.querySelectorAll(".xyz-input input")

XYZInput.forEach((input) =>
    input.addEventListener("change", () => {
        if (componentX.lastElementChild.value < 0) {
            componentX.lastElementChild.value = 0
        } 

        if (componentY.lastElementChild.value < 0) {
            componentY.lastElementChild.value = 0
        } 
        if (componentZ.lastElementChild.value < 0) {
            componentZ.lastElementChild.value = 0
        } 

        const rgb = XYZtoRGB([
            componentX.lastElementChild.value,
            componentY.lastElementChild.value,
            componentZ.lastElementChild.value,
        ])
        if (rgb.every((color) => color > -1 && color < 256)) {
            colorPicker.color.rgb = {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
            }
        } else {
            showNotification()
        }
    })
)

const HSLInput = document.querySelectorAll(".hsl-input input")

HSLInput.forEach((input) =>
    input.addEventListener("change", () => {
        if (componentH.lastElementChild.value > 360) {
            componentH.lastElementChild.value = 360
        } else if (componentH.lastElementChild.value < 0) {
            componentH.lastElementChild.value = 0
        }

        if (componentS.lastElementChild.value > 100) {
            componentS.lastElementChild.value = 100
        } else if (componentS.lastElementChild.value < 0) {
            componentS.lastElementChild.value = 0
        }

        if (componentL.lastElementChild.value > 100) {
            componentL.lastElementChild.value = 100
        } else if (componentL.lastElementChild.value < 0) {
            componentL.lastElementChild.value = 0
        }
        colorPicker.color.hsl = {
            h: componentH.lastElementChild.value,
            s: componentS.lastElementChild.value,
            l: componentL.lastElementChild.value,
        }
    })
)

const RGBInput = document.querySelectorAll(".rgb-input input")

RGBInput.forEach((input) =>
    input.addEventListener("change", (e) => {
        if (e.target.value > 255) {
            e.target.value = 255
        } else if (e.target.value) {
            e.target.value = 0
        }
        

        colorPicker.color.rgb = {
            r: componentR.lastElementChild.value,
            g: componentG.lastElementChild.value,
            b: componentB.lastElementChild.value,
        }
    })
)

colorPicker.on("color:change", function (color) {
    const rgbColor = color.rgb
    const xyzColor = RGBtoXYZ(Object.values(rgbColor))
    const hslColor = color.hsl

    componentR.lastElementChild.value = rgbColor.r
    componentG.lastElementChild.value = rgbColor.g
    componentB.lastElementChild.value = rgbColor.b

    componentX.lastElementChild.value = xyzColor.x.toFixed(2)
    componentY.lastElementChild.value = xyzColor.y.toFixed(2)
    componentZ.lastElementChild.value = xyzColor.z.toFixed(2)

    componentH.lastElementChild.value = hslColor.h
    componentS.lastElementChild.value = hslColor.s
    componentL.lastElementChild.value = hslColor.l

    document.body.style.background = color.rgbString
})

function showNotification() {
    notification.style.opacity = 1
    setTimeout(() => {
        notification.style.opacity = 0
    }, 4000)
}
