import { EventHandler } from "../../both/event_listener.js";
;
;
;
export class Component {
    constructor(gameobject = null) {
        this.gameobject = gameobject;
    }
    Start(time) {
    }
    OnEnable(time) {
    }
    OnDisable(time) {
    }
    Update(dt, time) {
    }
    LateUpdate(dt, time) {
    }
    OnRender(dt, time) {
    }
}
export class GameObject extends EventHandler {
    constructor(enabled = true, _components = []) {
        super();
        this.gameobject = this;
        this.enabled = false;
        this._components = new Map();
        this.children = [];
        this.parent = null;
        this.enabled = enabled;
        for (const c of _components) {
            this.AddComponent(c);
        }
    }
    AddComponent(component) {
        try {
            component.gameobject = this;
            this._components.set(component.constructor, component);
        }
        catch (e) {
            throw new Error(`Error in AddComponent: ${e}`);
        }
        return component;
    }
    RemoveComponent(component) {
        return this._components.delete(component);
    }
    HasComponent(component) {
        return this._components.has(component);
    }
    GetComponent(component) {
        const comp = this._components.get(component);
        if (comp) {
            return comp;
        }
        throw new Error(`GameObject doesn't have Component ${component.name}`);
    }
    get state() {
        return this.enabled;
    }
    set state(s) {
        if (s) {
            this.OnEnable(new Date().getTime());
        }
        else {
            this.OnDisable(new Date().getTime());
        }
        this.enabled = s;
    }
    Instantiate(obj) {
        const idx = this.children.push(obj);
        return this.children[idx - 1];
    }
    Destroy(obj) {
        const idx = this.children.indexOf(obj);
        if (idx < 0)
            return false; // Element is not a child
        this.children.splice(idx);
        return true; // Element was removed from children
    }
    /**
     * Called when the game starts or when the GameObject is created -> Won't be called if disaled and re-enabled
     * @param time time of calling
     */
    Start(time) {
        for (const c of this._components.values()) {
            c.Start(time);
        }
        for (const child of this.children) {
            child.Start(time);
        }
        this.emit("Start", time);
    }
    /**
     * Called when the GameObject is Enabled -> Will be called if disabled and re-enabled
     * @param time Unix time of calling
     */
    OnEnable(time) {
        for (const c of this._components.values()) {
            c.OnEnable(time);
        }
        for (const child of this.children) {
            child.OnEnable(time);
        }
        this.emit("OnEnable", time);
    }
    /**
     * Called when disabling the GameObject
     * @param time Unix time at calling
     */
    OnDisable(time) {
        for (const c of this._components.values()) {
            c.OnDisable(time);
        }
        for (const child of this.children) {
            child.OnDisable(time);
        }
        this.emit("OnDisable", time);
    }
    /**
     * Called every game update if the GameObject is enabled
     * Called BEFORE Rendering
     * @param dt Unix time delta since last game update
     */
    Update(dt, time) {
        for (const c of this._components.values()) {
            c.Update(dt, time);
        }
        for (const child of this.children) {
            child.Update(dt, time);
        }
        this.emit("Update", dt, time);
    }
    /**
     * Called every rendering step if the gameobject is enabled
     * @param dt Unix time delta
     * @param time Unix time at calling
     */
    OnRender(dt, time) {
        for (const c of this._components.values()) {
            c.OnRender(dt, time);
        }
        for (const child of this.children) {
            child.OnRender(dt, time);
        }
        this.emit("OnRender", dt, time);
    }
    /**
     * Called every game update if the GameObject is enabled
     * Called AFTER Rendering
     * @param dt Unix time delta since last game update
     */
    LateUpdate(dt, time) {
        for (const c of this._components.values()) {
            c.LateUpdate(dt, time);
        }
        for (const child of this.children) {
            child.LateUpdate(dt, time);
        }
        this.emit("LateUpdate", dt, time);
    }
}
