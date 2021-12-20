import * as Engine from "../scripts/game_engine_basic/game_engine.js";
/**
 * Component to modify the velocity component and apply the velocity to the position
 */
class Move_Component extends Engine.Component {
    constructor() {
        super(...arguments);
        this.dx = 0;
        this.dy = 0;
    }
    Update(dt, time) {
        const positition = this.gameobject?.GetComponent(Engine.Position2_Component);
        const velocity = this.gameobject?.GetComponent(Engine.Velocity2_Component);
        if (!positition)
            return;
        if (!velocity)
            return;
        velocity.x = this.dx;
        velocity.y = this.dy;
        if (Math.abs(this.dx) < 1) {
            this.dx = 0;
        }
        else {
            this.dx -= Math.sign(this.dx);
        }
        if (Math.abs(this.dy) < 1) {
            this.dy = 0;
        }
        else {
            this.dy -= Math.sign(this.dy);
        }
        positition.x += velocity.x / dt;
        positition.y += velocity.y / dt;
    }
}
class TurnToVelocity extends Engine.Component {
    Update(dt, time) {
        const velocity = this.gameobject?.GetComponent(Engine.Velocity2_Component);
        const rotation = this.gameobject?.GetComponent(Engine.Rotation_Component);
        if (!rotation)
            return;
        if (!velocity)
            return;
        const l = velocity.x * velocity.x + velocity.y + velocity.y;
        if (l <= 2e-8) {
            rotation.angle = 0;
            return;
        }
        rotation.angle = Math.atan2(velocity.y, velocity.x);
    }
}
class Scene extends Engine.GameObject {
    constructor() {
        super(...arguments);
        this.players = new Map();
    }
}
export function StartGame() {
    const scene = new Scene();
    //let player = new Engine.GameObject(true, [new Engine.Position2_Component(), new Engine.Rotation_Component(), new Engine.Velocity2_Component()]);
    //scene.Instantiate(player)
    //console.log(player._components)
    //let position = player.GetComponent(Engine.Position2_Component)
    //position.x = 50;
    //position.y = 100;
    //let p = player.GetComponent(Engine.Position2_Component)
    //console.log(p.x)
    //console.log(p.y)
    //let move = player.AddComponent(new Move_Component())
    scene.addEventListener("disconnect", (ws) => {
        let p = scene.players.get(ws);
        if (!p)
            return;
        scene.DestroyChild(p);
        scene.players.delete(ws);
    });
    scene.addEventListener("move", (ws, delta = [0, 0]) => {
        let player = scene.players.get(ws);
        if (!player)
            return;
        console.log(`command => ${delta} - ${typeof delta}`);
        let move_comp = player.GetComponent(Move_Component);
        if (Array.isArray(delta)) {
            console.log("delta is array");
            move_comp.dx = delta[0];
            move_comp.dy = delta[1];
            return;
        }
        console.log("Not Array");
    });
    scene.addEventListener("create_player", (ws) => {
        let player = new Engine.GameObject(true, [new Engine.Position2_Component(), new Engine.Rotation_Component(), new Engine.Velocity2_Component()]);
        player.AddComponent(new Move_Component());
        player = scene.Instantiate(player);
        scene.players.set(ws, player);
    });
    const frame_rate = 30;
    const interval_rate = 1000 / frame_rate;
    setInterval(() => { scene.Update(interval_rate, new Date().getTime()); }, interval_rate);
    return scene;
}
