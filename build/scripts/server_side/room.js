/**
 * Base class for room class, where WebSocket clients are grouped and can send messages to everyone in group
 */
export class IRoom {
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
    /**
     * Sends message to all the clients within the room - excluding some
     * @param msg Message to send
     * @param exclude Clients to exclude
     */
    Broadcast(msg, exclude = []) {
        this.clients.forEach((ws) => {
            if (!exclude.includes(ws))
                ws.send(msg);
        });
    }
}
