/**
 * Implementation of IMessage with IToString with JSON
 */
export class Message {
    /**
     * Creates a new WebSocket Message
     * @param action Event name
     * @param data arg to give the event call
     */
    constructor(action, data = null) {
        this.action = action;
        this.data = data;
    }
    ToString() {
        return JSON.stringify(this);
    }
}
