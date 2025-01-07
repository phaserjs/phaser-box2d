export function b2MakeSoft(hertz: any, zeta: any, h: any): b2Softness;
export function b2SolverTask(workerContext: any): void;
export function b2ContinuousQueryCallback(proxyId: any, shapeId: any, context: any): boolean;
export function b2SolveContinuous(world: any, bodySimIndex: any): void;
export function b2FastBodyTask(startIndex: any, endIndex: any, taskContext: any): void;
export function b2BulletBodyTask(startIndex: any, endIndex: any, taskContext: any): void;
export function b2Solve(world: any, stepContext: any): void;
export namespace b2SolverStageType {
    let b2_stagePrepareJoints: number;
    let b2_stagePrepareContacts: number;
    let b2_stageIntegrateVelocities: number;
    let b2_stageWarmStart: number;
    let b2_stageSolve: number;
    let b2_stageIntegratePositions: number;
    let b2_stageRelax: number;
    let b2_stageRestitution: number;
    let b2_stageStoreImpulses: number;
}
export namespace b2SolverBlockType {
    let b2_bodyBlock: number;
    let b2_jointBlock: number;
    let b2_contactBlock: number;
    let b2_graphJointBlock: number;
    let b2_graphContactBlock: number;
}
export class b2SolverBlock {
    startIndex: number;
    count: number;
    blockType: number;
    syncIndex: number;
}
export class b2SolverStage {
    type: number;
    blocks: any;
    blockCount: number;
    colorIndex: number;
    completionCount: number;
}
export class b2WorkerContext {
    context: b2StepContext;
    workerIndex: number;
    userTask: any;
}
export class b2Softness {
    constructor(biasRate?: number, massScale?: number, impulseScale?: number);
    biasRate: number;
    massScale: number;
    impulseScale: number;
    clone(): b2Softness;
}
export class b2StepContext {
    dt: number;
    inv_dt: number;
    h: number;
    inv_h: number;
    subStepCount: number;
    jointSoftness: b2Softness;
    contactSoftness: b2Softness;
    staticSoftness: b2Softness;
    restitutionThreshold: number;
    maxLinearVelocity: number;
    world: any;
    graph: any;
    states: any;
    sims: any;
    enlargedShapes: any;
    enlargedShapeCount: number;
    fastBodies: any;
    fastBodyCount: number;
    bulletBodies: any;
    bulletBodyCount: number;
    joints: any;
    contacts: any;
    simdContactConstraints: any;
    activeColorCount: number;
    workerCount: number;
    stages: any;
    stageCount: number;
    enableWarmStarting: boolean;
    atomicSyncBits: number;
}
