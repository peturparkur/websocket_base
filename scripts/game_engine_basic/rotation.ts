import { Component } from "./gameobject.js";

export class Rotation_Component extends Component{
    angle : number = 0;
    radians : boolean = true; // by default the angle is measured in radians
    
    constructor(angle : number = 0, radians : boolean = true){
        super()
        this.angle = angle;
        this.radians = radians;
    }
}