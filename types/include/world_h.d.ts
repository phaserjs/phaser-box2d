/**
 * @summary Gets the performance profile data for a Box2D world.
 * @function b2World_GetProfile
 * @param {b2WorldId} worldId - The identifier of the Box2D world.
 * @returns {void} A profile object containing performance metrics.
 * @description
 * This function returns performance profiling data for a Box2D world.
 * Not supported in Phaser Box2D JS implementation.
 */
export function b2World_GetProfile(worldId: b2WorldId): void;
/**
 * Gets the current counters from a Box2D world instance.
 * @function b2World_GetCounters
 * @param {b2WorldId} worldId - The ID of the Box2D world instance.
 * @returns {void} An object containing various Box2D performance counters.
 * @description
 * This function is not supported in the Phaser Box2D JS implementation and will
 * generate a console warning when called.
 */
export function b2World_GetCounters(worldId: b2WorldId): void;
/**
 * @summary Dumps memory statistics for a Box2D world (Not supported in Phaser Box2D JS)
 * @function b2World_DumpMemoryStats
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @returns {void}
 * @description
 * This function is a stub that displays a warning message indicating that memory statistics
 * dumping is not supported in the Phaser Box2D JavaScript implementation.
 */
export function b2World_DumpMemoryStats(worldId: b2WorldId): void;
/**
 * This file includes code that is:
 *
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */
/**
 * @import {b2WorldId} from './id_h.js'
 */
export const b2_maxWorkers: 1;
import type { b2WorldId } from './id_h.js';
export { b2SetType, b2World, b2CreateWorldArray, b2GetWorldFromId, b2GetWorld, b2GetWorldLocked, b2CreateWorld, b2World_Step, b2DestroyWorld, b2World_Draw, b2World_OverlapAABB, b2World_OverlapCapsule, b2World_OverlapCircle, b2World_OverlapPolygon, b2World_Explode, b2World_CastCapsule, b2World_CastCircle, b2World_CastPolygon, b2World_CastRay, b2World_CastRayClosest, b2World_GetBodyEvents, b2World_GetContactEvents, b2World_GetGravity, b2World_GetSensorEvents, b2World_SetContactTuning, b2World_SetJointTuning, b2World_SetPreSolveCallback, b2World_SetCustomFilterCallback, b2World_SetGravity, b2World_SetHitEventThreshold, b2World_SetRestitutionThreshold, b2World_IsValid, b2Joint_IsValid, b2World_EnableSleeping, b2World_EnableContinuous, b2World_EnableWarmStarting, b2ValidateConnectivity, b2ValidateSolverSets, b2ValidateContacts, b2CheckIndex, b2Body_IsValid, b2Chain_IsValid, b2Shape_IsValid } from "../world_c.js";
