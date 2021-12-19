import { Component } from "./gameobject.js";

export class Velocity2_Component extends Component{
    x : number = 0;
    y : number = 0;
    
    constructor(x : number = 0, y : number = 0){
        super()
        this.x = x;
        this.y = y;
    }
}