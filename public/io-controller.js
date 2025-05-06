async function reset() {
    await fetch("/reset", {method: "POST"});
    document.getElementById("play-pause").value = "Start";
    document.getElementById("play-pause").onclick = start;
}
async function start() {
    await fetch("/start", {method: "POST"});
    document.getElementById("play-pause").value = "Pause";
    document.getElementById("play-pause").onclick = pause;
}
async function win() {
    await fetch("/win", {method: "POST"});
    document.getElementById("play-pause").value = "Start";
    document.getElementById("play-pause").onclick = start;
}
async function pause() {
    await fetch("/pause", {method: "POST"});
    document.getElementById("play-pause").value = "Resume";
    document.getElementById("play-pause").onclick = resume;
}
async function resume() {
    await fetch("/resume", {method: "POST"});
    document.getElementById("play-pause").value = "Pause";
    document.getElementById("play-pause").onclick = pause;
}

const socket = io();
socket.on("intro", time => document.getElementById("state").innerText = `intro ${time}`);
socket.on("win", time => document.getElementById("state").innerText = `win ${time}`);
socket.on("paused", time => document.getElementById("state").innerText = `paused ${time}`);
socket.on("running", time => document.getElementById("state").innerText = `running ${time}`);
socket.on("win-credits", time => document.getElementById("state").innerText = `win-credits ${time}`);
