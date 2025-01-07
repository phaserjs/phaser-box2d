export function b2CreateStackAllocator(capacity: any): b2StackAllocator;
export function b2DestroyStackAllocator(allocator: any): void;
export function b2AllocateStackItem(alloc: any, size: any, name: any, ctor?: any): any;
export function b2FreeStackItem(alloc: any, mem: any): void;
export function b2GrowStack(alloc: any): void;
export function b2GetStackCapacity(alloc: any): any;
export function b2GetStackAllocation(alloc: any): any;
export function b2GetMaxStackAllocation(alloc: any): any;
/**
 * This file includes code that is:
 *
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */
/**
 * @namespace StackAllocator
*/
export class b2StackAllocator {
    data: any;
    entries: any;
}
