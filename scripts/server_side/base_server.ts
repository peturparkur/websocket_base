import path from "path"
import http from "http"
import WebSocket, {WebSocketServer} from 'ws'
import { EventHandler } from "../both/event_listener.js"
import express from "express"
import { Message } from "./message.js"

// UTILITY
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Room } from "./room.js"

function HasJsonStructure(str : string) {
    if (typeof str !== 'string') return false;
    try {
        const result = JSON.parse(str);
        const type = Object.prototype.toString.call(result);
        return type === '[object Object]' 
            || type === '[object Array]';
    } catch (err) {
        return false;
    }
}

function HasMessageStructure(obj : Object){
    if (!obj.hasOwnProperty("action"))
        return false
    if(!obj.hasOwnProperty("data"))
        return false
    return true
}

export class BaseServer extends Room{
    port : number;
    app : express.Express
    server : http.Server;
    wss : WebSocketServer;
    MessageHandler : EventHandler

    constructor(port : number = 3030, clients : Set<WebSocket> = new Set(), __directory : string = ""){
        const __filename = fileURLToPath(import.meta.url);
        if (__directory == "")
            __directory = dirname(__filename);
        super(clients)
        this.port = port
        this.app = express()
        console.log(`directory ${__directory}`)
        this.app.use('/client/', express.static(path.join(__directory, "../client/"))) //add the client files to online
        this.app.use('/both/', express.static(path.join(__directory, "../both/"))) //add the client files to online
        this.app.use('/example/client/', express.static(path.join(__directory, "../../example/client/"))) //add the client files to online

        this.app.get("/", (req, res) => {
            //res.sendFile(path.join(__directory, "index.html"));
            res.send({'connected' : 'true'})
        })

        this.MessageHandler = new EventHandler()

        this.server = new http.Server(this.app)
        this.wss = new WebSocketServer({'server' : this.server})

        this.wss.on('connection', (ws, req) => {
            this.AddClient(ws)
            ws.on('message', (_data, isBinary) =>{
                const data = _data.toString()
                console.log(`Received message: ${data}`)
                if(HasJsonStructure(data)){
                    let msg = JSON.parse(data)
                    if(HasMessageStructure(msg)){
                        //console.log(`Message received is valid`)
                        msg = msg as Message
                        this.MessageHandler.emit(msg.action, ws, msg.data)
                        return
                    }
                    console.log(`Message received is not Message format`)
                    this.MessageHandler.emit('error_content', ws, data)
                    return
                }
                console.log(`Message received is not JSON format`)
                this.MessageHandler.emit('error_format', ws, data)
                return
            })
            this.MessageHandler.emit('connected', ws)
        })
    }

    registerEventListener(eventName : string, callback : Function){
        this.MessageHandler.addEventListener(eventName, callback)
    }

    clearEvent(eventName : string){
        return this.MessageHandler.clearEvent(eventName)
    }

    removeEventListener(eventName : string, callback : Function){
        this.MessageHandler.removeEventListener(eventName, callback)
    }

    emit(eventName : string, ...data : any[]){
        this.MessageHandler.emit(eventName, ...data)
    }

    StartServer(port : number | null = null){
        if(port != null) this.port = port
        this.server.listen(this.port, () =>{
            console.log('Server is listening on ' + this.port)
        })
    }
}