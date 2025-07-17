let elements = {};
let currentRPM = 0, rpmAnimationFrame;
let turnSignalState = 0;
let turnSignalBlinkInterval = null;
let blinkVisible = true;
let leftBlinkInterval = null, rightBlinkInterval = null;
let leftBlinkOn = false, rightBlinkOn = false;
let indicators = 0, headlightState = 0, seatbeltState = 0;

function setEngine(state) {
    const button = document.getElementById('engineButton');
    const indicator = document.getElementById('engineIndicator');
    const label = document.getElementById('engineLabel');

    if (state) {
        button.classList.add('pressed', 'on');
        indicator.style.backgroundColor = 'limegreen';
        indicator.style.boxShadow = '0 0 6px rgba(0,255,0,0.8)';
        label.textContent = 'STOP';
    } else {
        button.classList.remove('pressed', 'on');
        indicator.style.backgroundColor = 'red';
        indicator.style.boxShadow = '0 0 6px rgba(255,0,0,0.8)';
        label.textContent = 'START';
    }
}


function setHeadlights(state) {
    const indicator = document.getElementById('headlights');
    headlightState = state;

    switch (state) {
        case 1:
            indicator.src = 'img/headlight-on.png';
            break;
        case 2:
            indicator.src = 'img/headlight-high.png';
            break;
        default:
            indicator.src = 'img/headlight-off.png';
    }
}

function setSeatbelts(state) {
    const seatbelt = document.getElementById('seatbelts');
    seatbelt.src = state ? 'img/seatbelt-on.png' : 'img/seatbelt-off.png';
}

function setSpeed(speedValue) {
    elements.speedValue.innerText = `${Math.round(speedValue * 2.236936)}`;
}

function setGear(gearValue) {
    elements.gearValue.innerText = String(gearValue);
}

function setRPM(targetRPM) {
    cancelAnimationFrame(rpmAnimationFrame);

    const centerX = 100;
    const centerY = 100;
    const radius = 87.5;
    const minAngle = 0;
    const maxAngle = 270;
    const speed = 0.20;

    function animate() {
        const diff = targetRPM - currentRPM;

        if (Math.abs(diff) < 0.001) {
            currentRPM = targetRPM;
        } else {
            currentRPM += diff * speed;
        }

        const angle = minAngle + currentRPM * (maxAngle - minAngle);
        const arcPath = describeArc(centerX, centerY, radius, minAngle, angle);
        elements.rpmPath.setAttribute("d", arcPath);

        const tipLength = 2.5;
        const tipStart = angle - tipLength;
        const tipEnd = angle;
        const tipPath = describeArc(centerX, centerY, radius, tipStart, tipEnd);
        elements.rpmTip.setAttribute("d", tipPath);

        if (Math.abs(diff) >= 0.001) {
            rpmAnimationFrame = requestAnimationFrame(animate);
        }
    }

    animate();
}

function setLeftIndicator(state) {
    indicators = (indicators & 0b10) | (state ? 0b01 : 0b00);
    
    if (state) {
        startLeftBlinking();
    } else {
        stopLeftBlinking();
    }
}

function setRightIndicator(state) {
    indicators = (indicators & 0b01) | (state ? 0b10 : 0b00);

    if (state) {
        startRightBlinking();
    } else {
        stopRightBlinking();
    }
}

function startLeftBlinking() {
    if (leftBlinkInterval) return; // already blinking

    leftBlinkInterval = setInterval(() => {
        leftBlinkOn = !leftBlinkOn;
        document.getElementById("leftIndicator").src = leftBlinkOn ? "img/leftsignal-on.png" : "img/leftsignal-off.png";
    }, 400);
}

function stopLeftBlinking() {
    clearInterval(leftBlinkInterval);
    leftBlinkInterval = null;
    leftBlinkOn = false;
    document.getElementById("leftIndicator").src = "img/leftsignal-off.png";
}

function startRightBlinking() {
    if (rightBlinkInterval) return;

    rightBlinkInterval = setInterval(() => {
        rightBlinkOn = !rightBlinkOn;
        document.getElementById("rightIndicator").src = rightBlinkOn ? "img/rightsignal-on.png" : "img/rightsignal-off.png";
    }, 400);
}

function stopRightBlinking() {
    clearInterval(rightBlinkInterval);
    rightBlinkInterval = null;
    rightBlinkOn = false;
    document.getElementById("rightIndicator").src = "img/rightsignal-off.png";
}


function setEngineHealth(percent) {
    const centerX = 100;
    const centerY = 100;
    const radius = 90;

    const startAngle = 201;
    const sweepAngle = 78;
    const endAngle = startAngle + (sweepAngle * percent);

    const arc = describeArc(centerX, centerY, radius, startAngle, endAngle);
    document.getElementById("engine").setAttribute("d", arc);
}

function setfuelHealth(percent) {
    const centerX = 100;
    const centerY = 100;
    const radius = 90;

    const startAngle = 151;
    const sweepAngle = 78;
    const endAngle = startAngle + (sweepAngle * percent);

    const arc = describeArc(centerX, centerY, radius, startAngle, endAngle);
    document.getElementById("fuel").setAttribute("d", arc);
}

function polarToCartesian(cx, cy, r, angleDeg) {
    const angleRad = (angleDeg - 90) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad)
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
}

function createTicks() {
    const ticksContainer = document.querySelector('.ticks');
    const tickCount = 10;
    
    for (let i = 0; i < tickCount; i++) {
        const tick = document.createElement('div');
        tick.className = 'tick';
        const angle = (i / (tickCount - 1)) * 270 - 135;
        tick.style.transform = `rotate(${angle}deg) translateY(-110px)`;
        ticksContainer.appendChild(tick);
    }
}

function createCircularNumbers() {
    const container = document.querySelector('.circular-number');
    const count = 10;
    const radius = 102;
    const centerX = 150;
    const centerY = 150;

    for (let i = 0; i < count; i++) {
        const angle = (i / (count - 1)) * 270 + 90;
        const rad = angle * (Math.PI / 180);
        const x = centerX + radius * Math.cos(rad);
        const y = centerY + radius * Math.sin(rad);

        const num = document.createElement('span');
        num.className = 'number';
        num.textContent = i;
        num.style.left = `${x}px`;
        num.style.top = `${y}px`;

        container.appendChild(num);
    }
}

createTicks();
createCircularNumbers();

function setFuel(fuel) {
    elements.fuelHealth.innerText = `${(fuel * 100).toFixed(1)}%`; // optional
    setfuelHealth(fuel); // <- update the arc visually
}

function setHealth(health) {
    elements.engineHealth.innerText = `${(health * 100).toFixed(1)}%`; // optional
    setEngineHealth(health); // <- update the arc visually
}

document.addEventListener("DOMContentLoaded", () => {
    elements = {
    engineButton    : document.getElementById('engineButton'),
    engineIndicator : document.getElementById('engineIndicator'),
    speedValue      : document.getElementById('speedValue'),
    gearValue       : document.getElementById('gearValue'),
    seatbelt        : document.getElementById('seatbelts'),
    rpmPath         : document.getElementById('rpmPath'),
    rpmTip          : document.getElementById('rpmTip'),
    rpmRedline      : document.getElementById('rpmRedline'),
    headlights      : document.getElementById('headlights'),
    fuelHealth      : document.getElementById('fuel'),
    engineHealth    : document.getElementById('engine'),
    leftIndicator   : document.getElementById('leftIndicator'),
    rightIndicator  : document.getElementById('rightIndicator')
};
        const redlineStart = 7.5 / 9;  // tick 8 out of 9 (normalized)
        const redlineEnd = 9 / 9;    // tick 9
        const fuelBgStart = 150;
        const fuelBgSweep = 80;
        const engineBgStart = 200;
        const engineBgSweep = 80;

        const centerX = 100;
        const centerY = 100;
        const radius = 87.5;
        const minAngle = 0;
        const maxAngle = 270;

        const redlineAngleStart = minAngle + redlineStart * (maxAngle - minAngle);
        const redlineAngleEnd = minAngle + redlineEnd * (maxAngle - minAngle);
        const fuelBgPath = describeArc(100, 100, 90, fuelBgStart, fuelBgStart + fuelBgSweep);
        const engineBgPath = describeArc(100, 100, 90, engineBgStart, engineBgStart + engineBgSweep);

        const redlinePath = describeArc(centerX, centerY, radius, redlineAngleStart, redlineAngleEnd);
        document.getElementById('rpmRedline').setAttribute('d', redlinePath);
        document.getElementById("fuelHealthBg").setAttribute("d", fuelBgPath);
        document.getElementById("engineHealthBg").setAttribute("d", engineBgPath);
    
    // setInterval(() => {
    //     try {
    //         const randomSpeed = Math.random() * 50;
    //         const randomGear = Math.floor(Math.random() * 7);
    //         const randomRPM = Math.random();
    //         const engineOn = Math.random() > 0.5;
    //         const randomState = Math.floor(Math.random() * 3);
    //         const randomEngine = Math.random();
    //         const randomfuel = Math.random();
    //         const randomleft = Math.random() > 0.5;
    //         const randomright = Math.random() > 0.5;
    //         const randomseat = Math.random() > 0.5;

    //         setSeatbelts(randomseat);
    //         setLeftIndicator(randomleft); // blinking ON
    //         setRightIndicator(randomright); // blinking ON
    //         setEngineHealth(1);
    //         setfuelHealth(1);
    //         setSpeed(randomSpeed);
    //         setGear(randomGear);
    //         setRPM(randomRPM);
    //         setEngine(engineOn);
    //         setHeadlights(randomState);
    //     } catch (e) {
    //         console.error("Update loop failed:", e);
    //     }
    // }, 1000);
});

