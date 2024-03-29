// DrawRectangle.js
function main() {
// Retrieve <canvas> element <- (1)
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG <- (2)
    ctx = canvas.getContext('2d');

    // Draw a blue rectangle <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
}

// loosely inspired by code examples from https://www.w3schools.com/js/js_validation.asp
function handleDrawEvent() {
    let text = "";
    v1x = parseFloat(document.getElementById("v1x").value);
    if (isNaN(v1x)) {
        console.log("invalid x1 is " + document.getElementById("v1x").value);
        text = "Please input a valid float for v1 x";
    }
    v1y = parseFloat(document.getElementById("v1y").value);
    if (isNaN(v1y)) {
        console.log("invalid y1 is " + document.getElementById("v1y").value);
        text = "Please input a valid float for v1 y";
    }
    v2x = parseFloat(document.getElementById("v2x").value);
    if (isNaN(v2x)) {
        console.log("invalid x2 is " + document.getElementById("v2x").value);
        text = "Please input a valid float for v2 x";
    }
    v2y = parseFloat(document.getElementById("v2y").value);
    if (isNaN(v2y)) {
        console.log("invalid y2 is " + document.getElementById("v2y").value);
        text = "Please input a valid float for v2 y";
    }
    document.getElementById("drawValidated").innerHTML = text;
    if (text == "") {
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        let v1 = new Vector3([v1x, v1y, 0]);
        drawVector(v1, 'red');
        let v2 = new Vector3([v2x, v2y, 0]);
        drawVector(v2, 'blue');
    }
}

function drawVector(inputVec, color) {
    let centerX = canvas.width/2;
    let centerY = canvas.height/2;
    let drawnVec = new Vector3(inputVec.elements);
    drawnVec.mul(20);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + drawnVec.elements[0], centerY - drawnVec.elements[1]);
    ctx.stroke();
}

function handleDrawOperationEvent() {
    let text = "";
    v1x = parseFloat(document.getElementById("v1x").value);
    if (isNaN(v1x)) {
        console.log("invalid x1 is " + document.getElementById("v1x").value);
        text = "Please input a valid float for v1 x";
    }
    v1y = parseFloat(document.getElementById("v1y").value);
    if (isNaN(v1y)) {
        console.log("invalid y1 is " + document.getElementById("v1y").value);
        text = "Please input a valid float for v1 y";
    }
    v2x = parseFloat(document.getElementById("v2x").value);
    if (isNaN(v2x)) {
        console.log("invalid x2 is " + document.getElementById("v2x").value);
        text = "Please input a valid float for v2 x";
    }
    v2y = parseFloat(document.getElementById("v2y").value);
    if (isNaN(v2y)) {
        console.log("invalid y2 is " + document.getElementById("v2y").value);
        text = "Please input a valid float for v2 y";
    }
    document.getElementById("drawValidated").innerHTML = text;
    if (text == "") {
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        var v1 = new Vector3([v1x, v1y, 0]);
        drawVector(v1, 'red');
        var v2 = new Vector3([v2x, v2y, 0]);
        drawVector(v2, 'blue');
    }
    let operation = document.getElementById("operation").value;
    if (operation == "add") {
        let v3 = new Vector3(v1.elements);
        v3.add(v2);
        drawVector(v3, 'green');
    }
    if (operation == "subtract") {
        let v3 = new Vector3(v1.elements);
        v3.sub(v2);
        drawVector(v3, 'green');
    }
    if (operation == "magnitude") {
        console.log("Magnitude v1: " + v1.magnitude());
        console.log("Magnitude v2: " + v2.magnitude());
    }
    if (operation == "normalize") {
        let v3 = new Vector3(v1.elements);
        let v4 = new Vector3(v2.elements);
        v3.normalize();
        v4.normalize();
        drawVector(v3, 'green');
        drawVector(v4, 'green');
    }
    if (operation == "angle-between") {
        let dotProd = Vector3.dot(v1, v2);
        mag1 = v1.magnitude();
        mag2 = v2.magnitude();
        let answer = dotProd/(mag1*mag2);
        answer = Math.acos(answer); // this is in radians, must be converted to degrees
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math#converting_between_degrees_and_radians
        answer = (answer * 180) / Math.PI;
        console.log("Angle: " + answer);
    }
    if (operation == "area") {
        let crossProd = Vector3.cross(v1, v2);
        let mag = crossProd.magnitude();
        console.log("Area: " + (mag/2));
    }
    var scalar = document.getElementById("scalar").value;
    if (operation == "multiply") {
        let v3 = new Vector3(v1.elements);
        let v4 = new Vector3(v2.elements);
        v3.mul(scalar);
        v4.mul(scalar);
        drawVector(v3, 'green');
        drawVector(v4, 'green');
    }
    if (operation == "divide") {
        let v3 = new Vector3(v1.elements);
        let v4 = new Vector3(v2.elements);
        v3.div(scalar);
        v4.div(scalar);
        drawVector(v3, 'green');
        drawVector(v4, 'asdasd');
    }
    
}