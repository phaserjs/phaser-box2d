export function b2GetIdCapacity(pool: any): any;
export function b2CreateIdPool(name?: string): b2IdPool;
export function b2DestroyIdPool(pool: any): void;
export function b2AllocId(pool: any): any;
export function b2FreeId(pool: any, id: any): void;
export function b2GetIdCount(pool: any): number;
export function b2ValidateFreeId(pool: any, id: any): void;
/**
 * @namespace IDPool
 */
export class b2IdPool {
    constructor(name: any);
    name: any;
    freeArray: any[];
    nextIndex: number;
}
