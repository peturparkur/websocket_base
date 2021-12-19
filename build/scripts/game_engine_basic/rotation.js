import { Component } from "./gameobject.js";
export class Rotation_Component extends Component {
    constructor(angle = 0, radians = true) {
        super();
        this.angle = 0;
        this.radians = true; // by default the angle is measured in radians
        this.angle = angle;
        this.radians = radians;
    }
}
