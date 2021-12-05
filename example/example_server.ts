import { BaseServer } from "../scripts/server_side/base_server.js";
import { Message } from "../scripts/server_side/message.js";
import WebSocket from 'ws'

const server = new BaseServer(3030)
server.RegisterEventListener('message', (ws : WebSocket, data : any) => {
    ws.send(JSON.stringify(new Message('message', `received data from someone ${data}`)))
})
server.RegisterEventListener('message', (ws : WebSocket, data : any) => {
    server.Broadcast(JSON.stringify(new Message('message', `received data from someone else ${data}`)), [ws])
})
server.RegisterEventListener('connected', (ws : WebSocket) => {
    ws.send(JSON.stringify(new Message('connected', `successfully connected`)))
})
server.RegisterEventListener('error', (ws : WebSocket, data : any) => {
    ws.send(JSON.stringify(new Message('error', `data format is not useable ${data}`)))
})
server.StartServer()