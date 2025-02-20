export function b2DestroySolverSet(world: any, setIndex: any): void;
/**
 * @param {b2World} world
 * @param {number} setIndex
 */
export function b2WakeSolverSet(world: b2World, setIndex: number): void;
export function b2TrySleepIsland(world: any, islandId: any): void;
export function b2MergeSolverSets(world: any, setId1: any, setId2: any): void;
export function b2TransferBody(world: any, targetSet: any, sourceSet: any, body: any): void;
export function b2TransferJoint(world: any, targetSet: any, sourceSet: any, joint: any): void;
/**
 * @namespace SolverSet
 */
/**
 * @import {b2World} from './include/world_h.js'
 */
export class b2SolverSet {
    sims: b2BodySimArray;
    states: b2BodyStateArray;
    joints: b2JointArray;
    contacts: b2ContactArray;
    islands: b2IslandArray;
    setIndex: number;
}
import type { b2World } from './include/world_h.js';
import { b2BodySimArray } from './include/block_array_h.js';
import { b2BodyStateArray } from './include/block_array_h.js';
import { b2JointArray } from './include/block_array_h.js';
import { b2ContactArray } from './include/block_array_h.js';
import { b2IslandArray } from './include/block_array_h.js';
