/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

// Deterministic solver
//
// Collide all awake contacts
// Use bit array to emit start/stop touching events in defined order, per thread. Try using contact index, assuming contacts are
// created in a deterministic order. bit-wise OR together bit arrays and issue changes:
// - start touching: merge islands - temporary linked list - mark root island dirty - wake all - largest island is root
// - stop touching: mark island dirty - wake island
// Reserve island jobs
// - island job does a DFS to merge/split islands. Mutex to allocate new islands. Split islands sent to different jobs.

export {
    b2Island, b2IslandSim,
    b2CreateIsland, b2DestroyIsland, b2GetIsland, b2LinkContact, b2UnlinkContact, b2LinkJoint, b2UnlinkJoint, b2MergeAwakeIslands, b2SplitIsland,
    b2ValidateIsland
} from '../island_c.js';
