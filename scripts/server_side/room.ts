import WebSocket from 'ws'
/**
 * Base class for room class, where WebSocket clients are grouped and can send messages to everyone in group
 */

export interface IRoomData{
    /**
     * clients within a room
     */
    clients : Set<WebSocket>;
}

export interface IBroadcastable {
    /**
     * Send the message to a given websocket(s)
     * @param msg message to be sent
     * @param client websocket(s) to send it to
     */
    SendTo(msg : any, client : WebSocket | Iterable<WebSocket>) : boolean;
}

export class Room implements IRoomData, IBroadcastable {
    /**
     * WebSocket clients within room
     */
    clients : Set<WebSocket> = new Set<WebSocket>()

    constructor(clients : Set<WebSocket> = new Set()){
        this.clients = new Set(clients) // create a copy of the set
    }
    /**
     * Adds a WebSocket client to the room
     * @param client Client to add
     * @returns {boolean} True if client has been added, False otherwise
     */
    public AddClient(client : WebSocket){
        if (this.clients.has(client)) return false
        this.clients.add(client)
        return true
    }
    /**
     * Removes a WebSocket client from the room
     * @param client Client to remove
     */
    public RemoveClient(client : WebSocket){
        return this.clients.delete(client)
    }

    private SendToWS(msg: any, client: WebSocket) : boolean{
        if (!this.clients.has(client)) return false;
        try{
            client.send(msg);
        }
        catch(e){
            return false;
        }
        return true;
    }
    private SendToAll(msg: any, clients: Iterable<WebSocket>) : boolean{
        // Set is not ordered
        for(const c of clients){
            if (!this.clients.has(c)) return false;
            try{
                c.send(msg);
            }
            catch(e){
                return false;
            }
        }
        return true;
    }

    public SendTo(msg: any, client: WebSocket | Iterable<WebSocket>): boolean {
        if(client instanceof WebSocket)
        {
            return this.SendToWS(msg, client)
        }
        return this.SendToAll(msg, client);
    }

    /**
     * Sends message to all the clients within the room - excluding some
     * @param msg Message to send
     * @param exclude Clients to exclude
     */
    public Broadcast(msg : any, exclude : Array<WebSocket> = []){
        const vals = new Set(this.clients.values());
        for(const c of exclude){
            vals.delete(c)
        }
        return this.SendTo(msg, vals);
    }
}