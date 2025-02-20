/**
 * @function CreateDebugDraw
 * @description Creates a debug drawing interface for Box2D that renders shapes to a canvas context.
 * The canvas is automatically sized to 1280x720 or 720x1280 based on window orientation.
 * All coordinates are transformed from Box2D world space to screen space.
 * This feature isn't meant for production. It is purely for debugging and testing. The code
 * is not optimized, stable or extensible. Implement your own drawing code for production.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas
 * @param {number} [scale=20] - The scale factor to convert Box2D coordinates to pixels
 * @returns {b2DebugDraw} A debug draw instance with methods for rendering Box2D shapes
 * The debug draw instance includes methods for drawing:
 * - Polygons (outlined and filled)
 * - Circles (outlined and filled)
 * - Capsules (outlined and filled)
 * - Images mapped to shapes
 * - Line segments
 * - Points
 * - Transforms
 */
export function CreateDebugDraw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale?: number): b2DebugDraw;
/**
 * @callback RAFCallback
 * @param {number} deltaTime - Time elapsed since last frame in seconds, capped at 0.1s
 * @param {number} totalTime - Total accumulated time in seconds
 * @param {number} currentFps - Current frames per second, updated once per second
 * @returns {void}
 */
/**
 * @function RAF
 * @summary Implements a requestAnimationFrame loop with timing and FPS tracking
 * @param {RAFCallback} callback - Function to call each frame with signature (deltaTime, totalTime, currentFps)
 * @description
 * Creates an animation loop using requestAnimationFrame that tracks timing information
 * and FPS. The callback is invoked each frame with the time delta, total time, and
 * current FPS. Frame delta time is capped at 100ms to avoid large time steps.
 */
export function RAF(callback: RAFCallback): void;
/**
 * Attach a graphic image to a physics body
 * @function AttachImage
 * @param {number} worldId - The ID of the Box2D world
 * @param {b2BodyId} bodyId - The ID of the body to attach the image to
 * @param {string} path - Directory path where the image is located
 * @param {string} imgName - Name of the image file
 * @param {b2Vec2} [drawOffset=null] - Offset vector for drawing the image
 * @param {b2Vec2} [drawScale=null] - Scale vector for drawing the image
 * @param {b2Vec2} [sourcePosition=null] - Position in the source image to start drawing from
 * @param {b2Vec2} [sourceSize=null] - Size of the region to draw from the source image
 * @returns {Object} The modified shape object with attached image properties
 * @description
 * Attaches an image to the last shape of a Box2D body. The function loads a PNG image
 * asynchronously and sets up drawing parameters including offset, scale, and source
 * rectangle coordinates. The image is stored in the shape's properties for later rendering.
 */
export function AttachImage(worldId: number, bodyId: b2BodyId, path: string, imgName: string, drawOffset?: b2Vec2, drawScale?: b2Vec2, sourcePosition?: b2Vec2, sourceSize?: b2Vec2): any;
/**
 * @function ConvertScreenToWorld
 * @description
 * Converts screen/canvas coordinates to world space coordinates in the Box2D physics system.
 * @param {HTMLCanvasElement} canvas - The canvas element being used for rendering
 * @param {number} drawScale - The scale factor between screen and world coordinates
 * @param {Object} ps - The screen position coordinates
 * @returns {b2Vec2} A vector containing the world space coordinates
 * @example
 * // Convert mouse click position to world coordinates
 * const worldPos = ConvertScreenToWorld(myCanvas, 30, mousePos);
 */
export function ConvertScreenToWorld(canvas: HTMLCanvasElement, drawScale: number, ps: any): b2Vec2;
/**
 * @function ConvertWorldToScreen
 * @summary Converts world coordinates to screen (canvas) coordinates
 * @param {HTMLCanvasElement} canvas - The canvas element used for rendering
 * @param {number} drawScale - The scale factor for converting world units to pixels
 * @param {b2Vec2} pw - The world position to convert
 * @returns {b2Vec2} The converted screen coordinates as a b2Vec2
 * @description
 * Transforms a position from world space to screen space, taking into account
 * the canvas dimensions, aspect ratio, and zoom level. The function maps the
 * world coordinates to normalized coordinates (0-1) and then scales them to
 * screen pixels.
 */
export function ConvertWorldToScreen(canvas: HTMLCanvasElement, drawScale: number, pw: b2Vec2): b2Vec2;
export type RAFCallback = (deltaTime: number, totalTime: number, currentFps: number) => void;
import { b2DebugDraw } from './include/types_h.js';
import { b2BodyId } from './main.js';
import { b2Vec2 } from './include/math_functions_h.js';
