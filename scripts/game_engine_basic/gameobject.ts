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

export type constructor<T> = new(...args : unknown[]) => T

interface IComponentContainer{
    _components : Map<Function, IComponent>;
}

interface IComponentManager extends IComponentContainer{
    AddComponent(component : IComponent) : boolean;
    RemoveComponent<C extends IComponent>(component: constructor<C>) : boolean;
    HasComponent<C extends IComponent>(component: constructor<C>) : boolean;
    GetComponent<C extends IComponent>(component: constructor<C>) : IComponent;
}

export interface IChild{
    parent : IGameObject | null;
}

export interface IParent{
    children : Array<IGameObject>;
}

export interface IBaseComponent extends IStart, IOnEnable, IOnDisable{};
export interface IComponent extends IBaseComponent, IUpdate, ILateUpdate, IOnRender{}
export interface IGameComponent extends IComponent, IComponentManager{};
export interface IGameObject extends  IGameComponent, IParent, IChild{};

export abstract class Component implements IComponent{
    gameobject : IGameObject | null;
    constructor(gameobject : IGameObject | null = null){
        this.gameobject = gameobject;
    }

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

export abstract class GameObject implements IGameObject{
    enabled : boolean = false;
    _components: Map<Function, IComponent> = new Map();
    children: IGameObject[] = [];
    parent: IGameObject | null = null;

    constructor(enabled : boolean = true, _components : Iterable<IComponent> = []) {
        this.enabled = enabled;
    }

    AddComponent(component: IComponent): boolean {
        try{
            this._components.set(component.constructor, component)
        }
        catch(e){
            throw new Error(`Error in AddComponent: ${e}`);
            return false;
        }
        return true;
    }
    RemoveComponent<C extends IComponent>(component: constructor<C>): boolean {
        return this._components.delete(component);
    }
    HasComponent<C extends IComponent>(component: constructor<C>): boolean {
        return this._components.has(component);
    }
    GetComponent<C extends IComponent>(component: constructor<C>): IComponent {
        const comp = this._components.get(component)
        if(comp){
            return comp
        }
        throw new Error(`GameObject doesn't have Component ${component.name}`)
    }

    /**
     * Called when the game starts or when the GameObject is created -> Won't be called if disaled and re-enabled
     * @param time time of calling
     */
    Start(time : number) : void{
        for(const c of this._components.values()){
            c.Start(time);
        }
    }

    /**
     * Called when the GameObject is Enabled -> Will be called if disabled and re-enabled
     * @param time Unix time of calling
     */
    OnEnable(time : number) : void{
        for(const c of this._components.values()){
            c.OnEnable(time);
        }
    }

    /**
     * Called when disabling the GameObject
     * @param time Unix time at calling
     */
    OnDisable(time : number) : void{
        for(const c of this._components.values()){
            c.OnDisable(time);
        }
    }

    /**
     * Called every game update if the GameObject is enabled
     * Called BEFORE Rendering
     * @param dt Unix time delta since last game update
     */
    Update(dt : number, time : number) : void{
        for(const c of this._components.values()){
            c.Update(dt, time);
        }
    }

    /**
     * Called every rendering step if the gameobject is enabled
     * @param dt Unix time delta
     * @param time Unix time at calling
     */
    OnRender(dt: number, time: number): void {
        for(const c of this._components.values()){
            c.OnRender(dt, time);
        }
    }

    /**
     * Called every game update if the GameObject is enabled
     * Called AFTER Rendering
     * @param dt Unix time delta since last game update
     */
    LateUpdate(dt : number, time : number) : void{
        for(const c of this._components.values()){
            c.LateUpdate(dt, time);
        }
    }
}