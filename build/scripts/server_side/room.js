import WebSocket from 'ws';
export class Room {
    constructor(clients = new Set()) {
        /**
         * WebSocket clients within room
         */
        this.clients = new Set();
        this.clients = new Set(clients); // create a copy of the set
    }
    /**
     * Adds a WebSocket client to the room
     * @param client Client to add
     * @returns {boolean} True if client has been added, False otherwise
     */
    AddClient(client) {
        if (this.clients.has(client))
            return false;
        this.clients.add(client);
        return true;
    }
    /**
     * Removes a WebSocket client from the room
     * @param client Client to remove
     */
    RemoveClient(client) {
        return this.clients.delete(client);
    }
    SendToWS(msg, client) {
        if (!this.clients.has(client))
            return false;
        try {
            client.send(msg);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    SendToAll(msg, clients) {
        // Set is not ordered
        for (const c of clients) {
            if (!this.clients.has(c))
                return false;
            try {
                c.send(msg);
            }
            catch (e) {
                return false;
            }
        }
        return true;
    }
    SendTo(msg, client) {
        if (client instanceof WebSocket) {
            return this.SendToWS(msg, client);
        }
        return this.SendToAll(msg, client);
    }
    /**
     * Sends message to all the clients within the room - excluding some
     * @param msg Message to send
     * @param exclude Clients to exclude
     */
    Broadcast(msg, exclude = []) {
        const vals = new Set(this.clients.values());
        for (const c of exclude) {
            vals.delete(c);
        }
        return this.SendTo(msg, vals);
    }
}
