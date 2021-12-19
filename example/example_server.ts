import { BaseServer } from "../scripts/server_side/base_server.js";
import { Message } from "../scripts/server_side/message.js";
import WebSocket from 'ws'

const server = new BaseServer(3030)
server.registerEventListener('message', (ws : WebSocket, data : any) => {
    ws.send(JSON.stringify(new Message('message', `received data from someone ${data}`)))
})
server.registerEventListener('message', (ws : WebSocket, data : any) => {
    server.Broadcast(JSON.stringify(new Message('message', `received data from someone else ${data}`)), [ws])
})
server.registerEventListener('connected', (ws : WebSocket) => {
    ws.send(JSON.stringify(new Message('connected', `successfully connected`)))
})
server.registerEventListener('error_format', (ws : WebSocket, data : any) => {
    ws.send(JSON.stringify(new Message('error_format', `data format is not useable ${data}  \n Use JSON`)))
})
server.registerEventListener('error_content', (ws : WebSocket, data : any) => {
    ws.send(JSON.stringify(new Message('error_content', `json format is not compatible with message structure ${data} \n Use {action : event, data : data} json format`)))
})
server.StartServer()