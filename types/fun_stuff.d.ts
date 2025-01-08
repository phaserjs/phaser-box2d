export class ActiveBall {
    constructor(id: any, createdTime: any);
    id: any;
    created: any;
}
export class Gun {
    constructor(position: any, power: any, frequency: any, life: any, radius: any, density: any, color: any, worldId: any);
    worldId: any;
    position: any;
    power: any;
    frequency: any;
    life: any;
    radius: any;
    density: any;
    color: any;
    activeBalls: any[];
    nextShotTime: any;
    totalTime: number;
    update(dt: any): void;
    destroyBall(ab: any): boolean;
}
export class Spinner {
    constructor(position: any, torque: any, speed: any, color: any, size: number, worldId: any);
}
