/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

// This is a stack-like arena allocator used for fast per step allocations.
// You must nest allocate/free pairs. The code will B2_ASSERT
// if you try to interleave multiple allocate/free pairs.
// This allocator uses the heap if space is insufficient.
// I could remove the need to free entries individually.
export {
    b2StackAllocator,
    b2CreateStackAllocator,
    b2DestroyStackAllocator,
    b2AllocateStackItem,
    b2FreeStackItem,
    b2GrowStack,
    b2GetStackCapacity,
    b2GetStackAllocation,
    b2GetMaxStackAllocation
} from '../stack_allocator_c.js';
