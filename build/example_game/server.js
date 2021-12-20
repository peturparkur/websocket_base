import { BaseServer } from "../scripts/server_side/base_server.js"; // Websocket server
import { Message } from "../scripts/server_side/message.js"; // Websocket server communication protocol
import { v4 as uuidv4 } from "uuid";
import { StartGame } from "./farming_game.js"; // Game Simulation
import { Position2_Component } from "../scripts/game_engine_basic/game_engine.js";
class GameServer extends BaseServer {
    constructor() {
        super(...arguments);
        this.client_ids = new Map();
        this.players = new Set();
        //client_hash : Map<string, WebSocket> = new Map()
    }
}
const server = new GameServer(3030);
server.registerEventListener('message', (ws, data) => {
    ws.send(JSON.stringify(new Message('message', `received data: ${data}`)));
});
server.registerEventListener('message', (ws, data) => {
    server.Broadcast(JSON.stringify(new Message('message', `received data from someone else ${data}`)), [ws]);
});
server.registerEventListener('connection', (ws) => {
    let s = uuidv4();
    server.client_ids.set(ws, s);
    //server.client_hash.set(s, ws)
    ws.send(JSON.stringify(new Message('connection', `successfully connected`)));
});
server.registerEventListener('error_format', (ws, data) => {
    ws.send(JSON.stringify(new Message('error_format', `data format is not useable ${data}  \n Use JSON`)));
});
server.registerEventListener('error_content', (ws, data) => {
    ws.send(JSON.stringify(new Message('error_content', `json format is not compatible with message structure ${data} \n Use {action : event, data : data} json format`)));
});
// Create Game
let game = StartGame();
server.registerEventListener("close", (ws, data) => {
    game.emit("disconnect", server.client_ids.get(ws));
});
server.registerEventListener('close', (ws, data) => {
    server.client_ids.delete(ws);
    server.players.delete(ws);
});
// Send the game details after the update cycle
game.addEventListener("Update", () => {
    const positions = [];
    for (const [id, p] of game.players.entries()) {
        let pos = p.GetComponent(Position2_Component);
        positions.push({ id: id, position: { "x": pos.x, "y": pos.y } });
    }
    for (const c of server.players) {
        let id = server.client_ids.get(c);
        if (!id)
            continue;
        let pos = game.players.get(id)?.GetComponent(Position2_Component);
        server.SendTo(JSON.stringify(new Message("GameUpdate", {
            "players": positions,
            "self": { id: id, position: { "x": pos?.x, "y": pos?.y } }
        })), c);
    }
    //server.Broadcast(JSON.stringify(new Message("GameUpdate",
    //{
    //    "players" : positions
    //}
    //)));
});
for (const [name, e] of game.listeners.entries()) {
    server.registerEventListener(`game_${name}`, (ws, ...data) => {
        console.log(`Calling ${name} => (${data}) -> ${typeof data}`);
        game.emit(name, server.client_ids.get(ws), ...data);
    });
}
server.registerEventListener("game_create_player", (ws, ...date) => {
    server.players.add(ws);
});
//server.registerEventListener('move', (ws : WebSocket, data : number) => {
//    game.emit("move", data);
//})
server.StartServer();
