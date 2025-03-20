let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let model;
let isDrawing = false;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "white";
ctx.lineWidth = 15;
ctx.lineCap = "round";

canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!isDrawing) return;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

function clearCanvas() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("result").innerText = "?";
}

async function loadModel() {
    model = await tf.loadLayersModel("https://storage.googleapis.com/tfjs-models/tfjs/mnist_model/model.json");
    console.log("Model Loaded!");
}

async function predict() {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let inputTensor = preprocessImage(imgData);
    let prediction = model.predict(inputTensor);
    let result = prediction.argMax(1).dataSync()[0];
    document.getElementById("result").innerText = result;
}

function preprocessImage(imageData) {
    let tensor = tf.browser.fromPixels(imageData, 1)
        .resizeNearestNeighbor([28, 28])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims(0);
    return tensor;
}

loadModel();