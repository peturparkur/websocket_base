/**
 * WebSocket Message Structure
 */
 export interface IMessage {
    /**
     * the event to call once passed sent
     */
    action : string;
    /**
     * the argument to pass into the event
     */
    data : any;
}

/**
 * Interface for ToString() convertible objects
 */
interface IToString {
    /**
     * Convert object to string
     */
    ToString() : string
}

/**
 * Implementation of IMessage with IToString with JSON
 */
export class Message implements IMessage, IToString{
    action: string;
    data: any;
    /**
     * Creates a new WebSocket Message
     * @param action Event name
     * @param data arg to give the event call
     */
    constructor(action : string, data : any = null){
        this.action = action;
        this.data = data;
    }
    ToString(): string {
        return JSON.stringify(this)
    }
}