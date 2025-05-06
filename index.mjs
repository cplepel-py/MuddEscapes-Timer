import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// All times given in milliseconds
const INTRO_TIME = 29 * 1000;
const WIN_TIME = 18 * 1000;

const {updateState, getState, getTime} = (() => {
    let state = "paused";
    let time = 0;
    return {
        updateState: (newState, newTime) => {
            state = newState;
            time = newTime;
            io.emit(state, time);
        },
        getState: () => state,
        getTime: () => time
    };
})();

app.post("/reset", async (req, res) => {
    updateState("paused", null);
    res.sendStatus(200);
});
app.post("/start", async (req, res) => {
    setTimeout(() => updateState("running", Date.now()), INTRO_TIME);
    updateState("intro", null);
    res.sendStatus(200);
});
app.post("/win", async (req, res) => {
    setTimeout(() => updateState("win-credits", null), WIN_TIME);
    updateState("win", Date.now() - getTime());
    res.sendStatus(200);
});
app.post("/pause", async (req, res) => {
    updateState("paused", Date.now() - getTime());
    res.sendStatus(200);
});
app.post("/resume", async (req, res) => {
    updateState("running", Date.now() - getTime());
    res.sendStatus(200);
});

io.on("connection", socket => {
    socket.emit(getState(), getTime());
});

const port = process.env.PORT || 8142;
server.listen(port, () => console.log(`App listening on port ${port}!`));
