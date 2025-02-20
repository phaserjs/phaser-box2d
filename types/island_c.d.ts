export function b2CreateIsland(world: any, setIndex: any): any;
export function b2DestroyIsland(world: any, islandId: any): void;
export function b2GetIsland(world: any, islandId: any): any;
export function b2LinkContact(world: any, contact: any): void;
export function b2UnlinkContact(world: any, contact: any): void;
export function b2LinkJoint(world: any, joint: any, mergeIslands: any): void;
export function b2UnlinkJoint(world: any, joint: any): void;
export function b2MergeAwakeIslands(world: any): void;
export function b2SplitIsland(world: any, baseId: any): void;
export function b2ValidateIsland(world: any, islandId: any): void;
/**
 * @namespace Island
 */
export class b2Island {
    setIndex: number;
    localIndex: number;
    islandId: number;
    headBody: number;
    tailBody: number;
    bodyCount: number;
    headContact: number;
    tailContact: number;
    contactCount: number;
    headJoint: number;
    tailJoint: number;
    jointCount: number;
    parentIsland: number;
    constraintRemoveCount: number;
}
export class b2IslandSim {
    islandId: number;
}
