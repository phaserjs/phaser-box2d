export function b2CreateGraph(graph: any, bodyCapacity: any): any;
export function b2DestroyGraph(graph: any): void;
export function b2AddContactToGraph(world: any, contactSim: any, contact: any): void;
export function b2RemoveContactFromGraph(world: any, bodyIdA: any, bodyIdB: any, colorIndex: any, localIndex: any): void;
export function b2CreateJointInGraph(world: any, joint: any): any;
export function b2AddJointToGraph(world: any, jointSim: any, joint: any): void;
export function b2RemoveJointFromGraph(world: any, bodyIdA: any, bodyIdB: any, colorIndex: any, localIndex: any): void;
/**
 * @namespace ConstraintGraph
 */
export const b2_overflowIndex: number;
export class b2GraphColor {
    bodySet: b2BitSet;
    contacts: b2ContactArray;
    joints: b2JointArray;
    overflowConstraints: any;
}
export class b2ConstraintGraph {
    colors: b2GraphColor[];
}
import { b2BitSet } from './include/bitset_h.js';
import { b2ContactArray } from './include/block_array_h.js';
import { b2JointArray } from './include/block_array_h.js';
