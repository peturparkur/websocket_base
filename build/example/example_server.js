import { BaseServer } from "../scripts/server_side/base_server.js";
import { Message } from "../scripts/server_side/message.js";
const server = new BaseServer(3030);
server.RegisterEventListener('message', (ws, data) => {
    ws.send(JSON.stringify(new Message('message', `received data from someone ${data}`)));
});
server.RegisterEventListener('message', (ws, data) => {
    server.Broadcast(JSON.stringify(new Message('message', `received data from someone else ${data}`)), [ws]);
});
server.RegisterEventListener('connected', (ws) => {
    ws.send(JSON.stringify(new Message('connected', `successfully connected`)));
});
server.RegisterEventListener('error', (ws, data) => {
    ws.send(JSON.stringify(new Message('error', `data format is not useable ${data}`)));
});
server.StartServer();
