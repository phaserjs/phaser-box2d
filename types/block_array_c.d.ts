export function b2CreateBodySimArray(capacity: any): b2BodySimArray;
export function b2CreateBodyStateArray(capacity: any): b2BodyStateArray;
export function b2CreateContactArray(capacity: any): b2ContactArray;
export function b2CreateJointArray(capacity: any): b2JointArray;
export function b2CreateIslandArray(capacity: any): b2IslandArray;
export function b2AddBodySim(array: any): any;
export function b2AddBodyState(array: any): any;
export function b2AddContact(array: any): any;
export function b2AddJoint(array: any): any;
export function b2AddIsland(array: any): any;
export function b2RemoveBodySim(array: any, index: any): any;
export function b2RemoveBodyState(array: any, index: any): any;
export function b2RemoveContact(array: any, index: any): any;
export function b2RemoveJoint(array: any, index: any): any;
export function b2RemoveIsland(array: any, index: any): any;
export class b2BodySimArray {
    constructor(capacity?: number);
    data: any[];
    count: number;
    capacity: number;
}
export class b2BodyStateArray {
    constructor(capacity?: number);
    data: any[];
    count: number;
    capacity: number;
}
export class b2ContactArray {
    constructor(capacity?: number);
    /** @type {b2ContactSim[]} */
    data: b2ContactSim[];
    count: number;
    capacity: number;
}
export class b2IslandArray {
    constructor(capacity?: number);
    data: any[];
    count: number;
    capacity: number;
}
export class b2JointArray {
    constructor(capacity?: number);
    data: any[];
    count: number;
    capacity: number;
}
import { b2ContactSim } from './include/contact_h.js';
