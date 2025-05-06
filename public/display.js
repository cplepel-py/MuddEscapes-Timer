const socket = io();

// All times given in milliseconds
const ROOM_TIME = 1 * 10 * 1000;  // Time to complete the room
const LOSE_TIME = 17 * 1000;  // Lose speech duration
const TICK_PERIOD = 100;  // Time between updates to timer text

function formatTime(ms) {
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
}

const timer_video = "bg_video.mp4";
const intro_video = timer_video;
const win_video = timer_video;
const lose_video = timer_video;
const win_credit_video = "creditsfa25.mp4";
const lose_credit_video = win_credit_video;

const intro_audio = "introtwist.mp3";
const timer_audio = "bg.mp3";
const win_audio = "winaudio.mp3";
const lose_audio = "loseaudio.mp3";
const win_credit_audio = "win.mp3";
const lose_credit_audio = "lose.mp3";

const intro_volume = 1;
const timer_volume = 0.15;
const win_volume = 0.5;
const lose_volume = 0.5;
const win_credit_volume = 0.1;
const lose_credit_volume = 0.2;

var endTime = null;
var timerTimeout = null;

function resolveURL(url) {
    return new URL(url, document.URL).toString();
}
function setDisplay(video, audio, text, volume=1, force=false) {
    if (force || document.getElementById("video").src != resolveURL(video)){
        document.getElementById("video").src = video;
    }
    if (force || document.getElementById("audio").src != resolveURL(audio)) {
        document.getElementById("audio").src = audio;
    }
    document.getElementById("audio").volume = volume;
    document.getElementById("timer-text").innerHTML = text;
}
function timerTick() {
    const remaining = endTime - Date.now();
    if (remaining > 0){
        console.log("tick");
        timerTimeout = setTimeout(timerTick, TICK_PERIOD);
        document.getElementById("timer-text").innerHTML = formatTime(remaining);
    } else if (remaining + LOSE_TIME > 0) {
        console.log("lost!")
        setDisplay(lose_video, lose_audio, formatTime(0), lose_volume, true);
        timerTimeout = setTimeout(() => {
            console.log("lose-credits");
            setDisplay(lose_credit_video, lose_credit_audio, "", lose_credit_volume);
        }, LOSE_TIME);
    } else {
        console.log("very-lost!");
        setDisplay(lose_credit_video, lose_credit_audio, "", lose_credit_volume);
    }
}

socket.on("intro", time => {
    console.log("intro", time);
    clearTimeout(timerTimeout);
    setDisplay(intro_video, intro_audio, formatTime(ROOM_TIME), intro_volume, true);
});
socket.on("running", time => {
    console.log("running", time);
    clearTimeout(timerTimeout);
    endTime = time + ROOM_TIME;
    setDisplay(timer_video, timer_audio, formatTime(ROOM_TIME + time - Date.now()), timer_volume);
    timerTick();
});
socket.on("win", time => {
    console.log("win", time);
    clearTimeout(timerTimeout);
    setDisplay(win_video, win_audio, formatTime(ROOM_TIME - time), win_volume, true);
});
socket.on("win-credits", time => {
    console.log("win-credits", time);
    clearTimeout(timerTimeout);
    setDisplay(win_credit_video, win_credit_audio, "", win_credit_volume);
});
socket.on("paused", time => {
    console.log("paused", time);
    clearTimeout(timerTimeout);
});
