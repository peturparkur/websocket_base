import { EventHandler } from "../../both/event_listener.js";

interface IStart {
    /**
     * Called when the game starts or when the GameObject is created -> Won't be called if disaled and re-enabled
     * @param time time of calling
     */
     Start(time : number) : void
}

interface IOnEnable{
    /**
     * Called when the GameObject is Enabled -> Will be called if disabled and re-enabled
     * @param time Unix time of calling
     */
     OnEnable(time : number) : void
}

interface IUpdate {
    /**
     * Called every game update if the GameObject is enabled
     * Called BEFORE Rendering
     * @param dt Unix time delta since last game update
     */
     Update(dt : number, time : number) : void
}
interface ILateUpdate{
    /**
     * Called every game update if the GameObject is enabled
     * Called AFTER Rendering
     * @param dt Unix time delta since last game update
     */
     LateUpdate(dt : number, time : number) : void
}

interface IOnDisable{
    /**
     * Called when disabling the GameObject
     * @param time Unix time at calling
     */
     OnDisable(time : number) : void
}

interface IOnRender{
    /**
     * Called when rendering a scene
     * @param dt Unix time delta
     * @param time Unix time at calling
     */
    OnRender(dt : number, time : number) : void
}

export type constructor<T> = new(...args : any[]) => T

interface IComponentContainer{
    _components : Map<Function, IComponent>;
}

interface IComponentManager extends IComponentContainer{
    AddComponent<C extends IComponent>(component : C) : C;
    RemoveComponent<C extends IComponent>(component: constructor<C>) : boolean;
    HasComponent<C extends IComponent>(component: constructor<C>) : boolean;
    GetComponent<C extends IComponent>(component: constructor<C>) : C;
}

export interface IChild{
    parent : IGameObject | null;
}

export interface IParent{
    children : Array<IGameObject>;
}

export interface IComponentData{
    gameobject : IGameObject | null;
}

export interface IBaseComponent extends IStart, IOnEnable, IOnDisable{};
export interface IComponent extends IBaseComponent, IUpdate, ILateUpdate, IOnRender, IComponentData{}
export interface IGameComponent extends IComponent, IComponentManager{};
export interface IGameObject extends  IGameComponent, IParent, IChild{
    Destroy() : boolean
    DestroyChild(obj : IGameObject) : boolean
    Instantiate<C extends IGameObject>(obj : C) : C
};

export abstract class Component implements IComponent{
    constructor(gameobject : IGameObject | null = null){
        this.gameobject = gameobject;
    }
    gameobject: IGameObject | null;

    Start(time: number): void {
    }
    OnEnable(time: number): void {
    }
    OnDisable(time: number): void {
    }
    Update(dt: number, time: number): void {
    }
    LateUpdate(dt: number, time: number): void {
    }
    OnRender(dt: number, time: number): void {
    }
}

export class GameObject extends EventHandler implements IGameObject{
    gameobject: IGameObject | null = this;
    private enabled : boolean = false;
    _components: Map<Function, IComponent> = new Map();
    children: IGameObject[] = [];
    parent: IGameObject | null = null;

    constructor(enabled : boolean = true, _components : Iterable<IComponent> = []) {
        super();
        this.enabled = enabled;
        for(const c of _components){
            this.AddComponent(c);
        }
    }

    AddComponent<C extends IComponent>(component: C): C {
        try{
            component.gameobject = this;
            this._components.set(component.constructor, component)
        }
        catch(e){
            throw new Error(`Error in AddComponent: ${e}`);
        }
        return component;
    }
    RemoveComponent<C extends IComponent>(component: constructor<C>): boolean {
        return this._components.delete(component);
    }
    HasComponent<C extends IComponent>(component: constructor<C>): boolean {
        return this._components.has(component);
    }
    GetComponent<C extends IComponent>(component: constructor<C>): C {
        const comp = this._components.get(component)
        if(comp){
            return comp as C
        }
        throw new Error(`GameObject doesn't have Component ${component.name}`)
    }

    get state(){
        return this.enabled
    }

    set state(s : boolean){
        if(s){
            this.OnEnable(new Date().getTime());
        }
        else{
            this.OnDisable(new Date().getTime())
        }
        this.enabled = s;
    }

    Instantiate<C extends IGameObject>(obj : C) : C{
        const idx = this.children.push(obj);
        return this.children[idx - 1] as C;
    }

    DestroyChild(obj : IGameObject) : boolean{
        const idx = this.children.indexOf(obj)
        if (idx < 0) return false; // Element is not a child
        let g = this.children.splice(idx, 1)[0]
        return g.Destroy();
        //g._components.clear()
        //return true // Element was removed from children
    }

    Destroy() : boolean{
        for(const [k, c] of this._components.entries()){
            c.gameobject = null;
        }
        this._components.clear()

        let idx = this.parent?.children.indexOf(this)
        if(idx && (idx >= 0)){
            this.parent?.children.splice(idx, 1);
        }

        this.parent = null;
        let r = true;
        for(const child of this.children.splice(0, this.children.length)){
            r = r && child.Destroy()
        }
        this.children = [];
        return r;
    }

    /**
     * Called when the game starts or when the GameObject is created -> Won't be called if disaled and re-enabled
     * @param time time of calling
     */
    Start(time : number) : void{
        for(const c of this._components.values()){
            c.Start(time);
        }
        for(const child of this.children){
            child.Start(time);
        }
        this.emit("Start", time);
    }

    /**
     * Called when the GameObject is Enabled -> Will be called if disabled and re-enabled
     * @param time Unix time of calling
     */
    OnEnable(time : number) : void{
        for(const c of this._components.values()){
            c.OnEnable(time);
        }
        for(const child of this.children){
            child.OnEnable(time);
        }
        this.emit("OnEnable", time);
    }

    /**
     * Called when disabling the GameObject
     * @param time Unix time at calling
     */
    OnDisable(time : number) : void{
        for(const c of this._components.values()){
            c.OnDisable(time);
        }
        for(const child of this.children){
            child.OnDisable(time);
        }
        this.emit("OnDisable", time);
    }

    /**
     * Called every game update if the GameObject is enabled
     * Called BEFORE Rendering
     * @param dt Unix time delta since last game update
     */
    Update(dt : number, time : number) : void{
        if(!this.enabled) return;

        for(const c of this._components.values()){
            c.Update(dt, time);
        }
        for(const child of this.children){
            child.Update(dt, time);
        }
        this.emit("Update", dt, time);
    }

    /**
     * Called every rendering step if the gameobject is enabled
     * @param dt Unix time delta
     * @param time Unix time at calling
     */
    OnRender(dt: number, time: number): void {
        if(!this.enabled) return;

        for(const c of this._components.values()){
            c.OnRender(dt, time);
        }
        for(const child of this.children){
            child.OnRender(dt, time);
        }
        this.emit("OnRender", dt, time);
    }

    /**
     * Called every game update if the GameObject is enabled
     * Called AFTER Rendering
     * @param dt Unix time delta since last game update
     */
    LateUpdate(dt : number, time : number) : void{
        if(!this.enabled) return;

        for(const c of this._components.values()){
            c.LateUpdate(dt, time);
        }
        for(const child of this.children){
            child.LateUpdate(dt, time);
        }
        this.emit("LateUpdate", dt, time);
    }
}