/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2AABB, b2Add, b2Sub, b2TransformPointOut, b2Vec2 } from './include/math_functions_h.js';
import { b2BodyId, b2WorldId } from './main.js';

import { b2Body_GetShapes } from './body_c.js';
import { b2ComputeShapeAABB } from './shape_c.js';
import { b2DebugDraw } from './include/types_h.js';
import { b2GetWorldFromId } from './world_c.js';

/**
 * @namespace DebugDraw
 */

const p0 = new b2Vec2();
const disableDrawing = false;

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
export function CreateDebugDraw(canvas, ctx, scale = 20.0)
{
    let wide = 1280;
    let high = 720;

    if (canvas) {

        function resizeCanvas() {
            
            if (window.innerWidth < window.innerHeight) {
                // portrait mode
                wide = canvas.width = 720;
                high = canvas.height = 1280;
            } else {
                // landscape mode
                wide = canvas.width = 1280;
                high = canvas.height = 720;
            }

            const dpi = window.devicePixelRatio;

            canvas.width = wide * dpi;
            canvas.height = high * dpi;
    
            canvas.style.width = wide + 'px';
            canvas.style.height = high + 'px';
    
            ctx.scale(dpi, dpi);
        }

        window.addEventListener('resize', resizeCanvas);

        resizeCanvas();
    }

    const draw = new b2DebugDraw();

    if (disableDrawing) {
        draw.DrawCapsule = () => { return; }
        draw.DrawCircle = () => { return; }
        draw.DrawPoint = () => { return; }
        draw.DrawPolygon = () => { return; }
        draw.DrawImageCapsule = () => { return; }
        draw.DrawImageCircle = () => { return; }
        draw.DrawImagePolygon = () => { return; }
        draw.DrawSegment = () => { return; }
        draw.DrawSolidCapsule = () => { return; }
        draw.DrawSolidCircle = () => { return; }
        draw.DrawSolidPolygon = () => { return; }
        draw.DrawString = () => { return; }
        draw.DrawTransform = () => { return; }
        return draw;
    }

    draw.DrawPolygon = function(xf, vs, ps, col, ctx) {
        ctx.beginPath();
    
        const r = (col >> 16) & 0xFF;
        const g = (col >> 8) & 0xFF;
        const b = col & 0xFF;
        const a = 0.5;  //((col >> 24) & 0xFF) / 255;
    
        //const c = new b2Vec2(wide / 2, high / 2);
        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;
    
        // Transform and draw the polygon
        for (let i = 0; i < ps; i++) {
            b2TransformPointOut( xf, vs[i], p0 );
            p0.y = -p0.y;
            //let p1 = b2MulSV(scale, p0);
            let p1X = scale * p0.x;
            let p1Y = scale * p0.y;
            //let v = b2Add(p1, c);
            let vX = p1X + cX;
            let vY = p1Y + cY;
            
            if (i === 0) {
                ctx.moveTo(vX, vY);
            } else {
                ctx.lineTo(vX, vY);
            }
        }
    
        ctx.closePath();
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    draw.DrawImagePolygon = function(xf, shape, ctx) {
        let aabb = b2ComputeShapeAABB(shape, xf);

        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;
        // Transform the center point
        const centerX = xf.p.x;
        const centerY = xf.p.y;
        const scaleCenterX = scale * centerX;
        const scaleCenterY = scale * centerY;
        let transformedCenterX = scaleCenterX + cX;
        let transformedCenterY = scaleCenterY - cY;
        transformedCenterY = -transformedCenterY;
    
        // Save the current canvas state
        ctx.save();
    
        // Move to the center of where we want to draw the image
        ctx.translate(transformedCenterX, transformedCenterY);
    
        // Rotate the canvas
        // Negate the angle because we're rotating the context, not the object
        const angle = -Math.atan2(xf.q.s, xf.q.c);
        ctx.rotate(angle);
    
        // Calculate positioning to center the image
        const image = shape.image;
        const imageScale = shape.imageScale || new b2Vec2(1, 1);
        const imageOffset = shape.imageOffset || new b2Vec2(0, 0);
        let drawWidth = aabb.upperBoundX - aabb.lowerBoundX;
        let drawHeight = aabb.upperBoundY - aabb.lowerBoundY;
        const aspectRatio = drawWidth / drawHeight;
        
        if (aspectRatio > 1) {
            drawHeight *= scale * imageScale.x;
            drawWidth = drawHeight * aspectRatio * imageScale.y;
        } else {
            drawWidth *= scale * imageScale.x;
            drawHeight = drawWidth / aspectRatio * imageScale.y;
        }
        
        // Draw the image centered at (0, 0) of the rotated context
        ctx.drawImage(image,
            shape.imageRect.lowerBoundX, shape.imageRect.lowerBoundY,
            shape.imageRect.upperBoundX, shape.imageRect.upperBoundY,
            -drawWidth / 2 + drawWidth * imageOffset.x, -drawHeight / 2 + drawHeight * imageOffset.y,
            drawWidth, drawHeight
        );
    
        // Restore the canvas state
        ctx.restore();
    };

    draw.DrawSolidPolygon = function(xf, vs, ps, rad, col, ctx) {
        ctx.beginPath();
    
        const r = (col >> 16) & 0xFF;
        const g = (col >> 8) & 0xFF;
        const b = col & 0xFF;
        const a = 0.5;  //((col >> 24) & 0xFF) / 255;
    
        //const c = new b2Vec2(wide / 2, high / 2);
        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;
    
        // Transform and draw the polygon
        for (let i = 0; i < ps; i++) {
            b2TransformPointOut( xf, vs[i], p0 );
            p0.y = -p0.y;
            //let p1 = b2MulSV(scale, p0);
            let p1X = scale * p0.x;
            let p1Y = scale * p0.y;
            //let v = b2Add(p1, c);
            let vX = p1X + cX;
            let vY = p1Y + cY;
            
            if (i === 0) {
                ctx.moveTo(vX, vY);
            } else {
                ctx.lineTo(vX, vY);
            }
        }
    
        ctx.closePath();
    
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
    
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.lineWidth = rad * 2; // Use the radius for line width
        ctx.stroke();
    };

    draw.DrawCircle = function(center, rad, col, ctx) {
        ctx.beginPath();
        const r = (col >> 16) & 0xFF;
        const g = (col >> 8) & 0xFF;
        const b = col & 0xFF;
        const a = 0.5;  // ((col >> 24) & 0xFF) / 255;
        // const c = new b2Vec2(wide / 2, high / 2);
        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;

        // Transform the center point
        //let scaledCenter = b2MulSV(scale, center);
        const scaleCenterX = scale * cX;
        const scaleCenterY = scale * cY;
        //let transformedCenter = b2Add(scaledCenter, c);
        let transformedCenterX = scaleCenterX + cX;
        let transformedCenterY = scaleCenterY + cY;
        transformedCenterY = -transformedCenterY;
    
        // Draw the circle
        ctx.arc(transformedCenterX, transformedCenterY, rad * scale, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.lineWidth = 2; // Use a fixed line width for the circle outline
        ctx.stroke();
    };

    draw.DrawImageCircle = function(xf, rad, shape, ctx) {
        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;
        // Transform the center point
        //let center = b2TransformPoint(xf, new b2Vec2(0, 0));
        const centerX = xf.p.x;
        const centerY = -xf.p.y;
        // let scaledCenter = b2MulSV(scale, center);
        const scaleCenterX = scale * centerX;
        const scaleCenterY = scale * centerY;
        //let transformedCenter = b2Add(scaledCenter, c);
        let transformedCenterX = scaleCenterX + cX;
        let transformedCenterY = scaleCenterY + cY;
        transformedCenterY = -transformedCenterY;
    
        // Save the current canvas state
        ctx.save();
    
        // Move to the center of where we want to draw the image
        ctx.translate(transformedCenterX, transformedCenterY);
    
        // Rotate the canvas
        // The rotation is counter-clockwise in Box2D, but clockwise in canvas
        // So we need to negate the angle
        const angle = -Math.atan2(xf.q.s, xf.q.c);
        ctx.rotate(angle);
    
        // Calculate positioning to center the image
        const image = shape.image;
        const imageScale = shape.imageScale || new b2Vec2(1, 1);
        const imageOffset = shape.imageOffset || new b2Vec2(0, 0);
        const aspectRatio = image.width / image.height;
        let drawWidth, drawHeight;
        
        if (aspectRatio > 1) {
            drawHeight = rad * 2 * scale * imageScale.x;
            drawWidth = drawHeight * aspectRatio * imageScale.y;
        } else {
            drawWidth = rad * 2 * scale * imageScale.x;
            drawHeight = drawWidth / aspectRatio * imageScale.y;
        }
        
        // Draw the image centered at (0, 0) of the rotated context
        ctx.drawImage(image, -drawWidth / 2 + drawWidth * imageOffset.x, -drawHeight / 2 + drawHeight * imageOffset.y, drawWidth, drawHeight);
    
        // Restore the canvas state
        ctx.restore();
    };

    draw.DrawSolidCircle = function(xf, rad, col, ctx) {
        ctx.beginPath();
        const r = (col >> 16) & 0xFF;
        const g = (col >> 8) & 0xFF;
        const b = col & 0xFF;
        const a = 0.5;  // ((col >> 24) & 0xFF) / 255;
        // const c = new b2Vec2(wide / 2, high / 2);
        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;
    
        // Transform the center point
        //let center = b2TransformPoint(xf, new b2Vec2(0, 0));
        const centerX = xf.p.x;
        const centerY = -xf.p.y;
        // let scaledCenter = b2MulSV(scale, center);
        const scaleCenterX = scale * centerX;
        const scaleCenterY = scale * centerY;
        //let transformedCenter = b2Add(scaledCenter, c);
        let transformedCenterX = scaleCenterX + cX;
        let transformedCenterY = scaleCenterY + cY;
    
        // Draw the circle
        ctx.arc(transformedCenterX, transformedCenterY, rad * scale, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.lineWidth = 2; // Use a fixed line width for the circle outline
        ctx.stroke();
    };

    draw.DrawImageCapsule = function(p1, p2, radius, shape, ctx) {
        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;

        const rs = radius * scale;

        // Transform the points
        const tp1 = p1;
        const tp2 = p2;
        tp1.y = -tp1.y;
        tp2.y = -tp2.y;
        const scaledP1X = scale * tp1.x;
        const scaledP1Y = scale * tp1.y;
        const scaledP2X = scale * tp2.x;
        const scaledP2Y = scale * tp2.y;
        let transformedP1X = scaledP1X + cX;
        let transformedP1Y = scaledP1Y + cY;
        let transformedP2X = scaledP2X + cX;
        let transformedP2Y = scaledP2Y + cY;
    
        // Calculate the angle and length of the capsule's main axis
        let dx = transformedP2X - transformedP1X;
        let dy = transformedP2Y - transformedP1Y;
        let angle = Math.atan2(dy, dx);
        let length = Math.sqrt(dx * dx + dy * dy);
    
        // Save the current canvas state
        ctx.save();
    
        ctx.translate(transformedP1X + dx / 2, transformedP1Y + dy / 2);
        ctx.rotate(angle + Math.PI / 2);

        // Calculate positioning to center the image
        const image = shape.image;
        const imageScale = shape.imageScale || new b2Vec2(1, 1);
        const imageOffset = shape.imageOffset || new b2Vec2(0, 0);
        const aspectRatio = image.width / image.height;
        const overlap = 1.1;
        let drawHeight = (length + rs * 2) * overlap * imageScale.y;
        let drawWidth = (rs * 2) * overlap * Math.abs(imageScale.x);
        
        // negative imageScale.x indicates the image should be mirrored
        ctx.scale(Math.sign(imageScale.x), 1);

        // Draw the image centered at (0, 0) of the rotated context
        ctx.drawImage(image,
            shape.imageRect.lowerBoundX, shape.imageRect.lowerBoundY,
            shape.imageRect.upperBoundX, shape.imageRect.upperBoundY,
            -drawWidth / 2 + drawWidth * imageOffset.x, -drawHeight / 2 + drawHeight * imageOffset.y,
            drawWidth, drawHeight);

        // Restore the canvas state
        ctx.restore();
    };

    draw.DrawSolidCapsule = function(p1, p2, radius, col, ctx) {
        const r = (col >> 16) & 0xFF;
        const g = (col >> 8) & 0xFF;
        const b = col & 0xFF;
        const a = 0.5;  // ((col >> 24) & 0xFF) / 255;
        // const c = new b2Vec2(wide / 2, high / 2);
        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;
    
        // Transform the points
        //let tp1 = b2TransformPoint(b2Transform.identity(), p1);
        //let tp2 = b2TransformPoint(b2Transform.identity(), p2);
        const tp1 = p1;
        const tp2 = p2;
        tp1.y = -tp1.y;
        tp2.y = -tp2.y;
        //let scaledP1 = b2MulSV(scale, tp1);
        const scaledP1X = scale * tp1.x;
        const scaledP1Y = scale * tp1.y;
        //let scaledP2 = b2MulSV(scale, tp2);
        const scaledP2X = scale * tp2.x;
        const scaledP2Y = scale * tp2.y;
        // let transformedP1 = b2Add(scaledP1, c);
        let transformedP1X = scaledP1X + cX;
        let transformedP1Y = scaledP1Y + cY;
        // let transformedP2 = b2Add(scaledP2, c);
        let transformedP2X = scaledP2X + cX;
        let transformedP2Y = scaledP2Y + cY;
    
        // Calculate the angle and length of the capsule's main axis
        let dx = transformedP2X - transformedP1X;
        let dy = transformedP2Y - transformedP1Y;
        let angle = Math.atan2(dy, dx);
        let length = Math.sqrt(dx * dx + dy * dy);
    
        // Draw the capsule
        ctx.save();
        ctx.translate(transformedP1X, transformedP1Y);
        ctx.rotate(angle);
    
        ctx.beginPath();
        
        // Draw the capsule shape
        ctx.arc(0, 0, radius * scale, Math.PI / 2, -Math.PI / 2);
        ctx.lineTo(length, -radius * scale);
        ctx.arc(length, 0, radius * scale, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(0, radius * scale);
        ctx.closePath();
    
        // Fill the capsule
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
    
        // Stroke the capsule (who's a good capsule? You are, yes you are!)
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.lineWidth = 2;
        ctx.stroke();
    
        ctx.restore();
    };

    draw.DrawSegment = function(p1, p2, col, ctx) {
        ctx.beginPath();
        const r = (col >> 16) & 0xFF;
        const g = (col >> 8) & 0xFF;
        const b = col & 0xFF;
        const a = 0.5;  // Fixed alpha value, similar to the polygon function
        // const c = new b2Vec2(wide / 2, high / 2);
        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;
    
        // Transform and draw the line
        //let tp1 = b2TransformPoint(b2Transform.identity(), p1);
        //let tp2 = b2TransformPoint(b2Transform.identity(), p2);
        const tp1 = p1;
        const tp2 = p2;
        
        tp1.y = -tp1.y;
        tp2.y = -tp2.y;
        
        //let v1 = b2Add(b2MulSV(scale, tp1), c);
        const v1X = (scale * tp1.x) + cX;
        const v1Y = (scale * tp1.y) + cY;
        //let v2 = b2Add(b2MulSV(scale, tp2), c);
        const v2X = (scale * tp2.x) + cX;
        const v2Y = (scale * tp2.y) + cY;
    
        ctx.moveTo(v1X, v1Y);
        ctx.lineTo(v2X, v2Y);
    
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.lineWidth = 2; // You can adjust this value as needed
        ctx.stroke();
    };

    draw.DrawPoint = function(x, y, radius, col, ctx) {
        const r = (col >> 16) & 0xFF;
        const g = (col >> 8) & 0xFF;
        const b = col & 0xFF;
        const a = 0.5;  // Fixed alpha value, similar to previous functions
        // const c = new b2Vec2(wide / 2, high / 2);
        const cX = (wide >> 1) + this.positionOffset.x;
        const cY = (high >> 1) + this.positionOffset.y;
    
        // Transform the point (PJB: except it's the identity, it does do anything)
        //b2TransformPoint(b2Transform.identity(), p);
        // let tp = new b2Vec2(x, y);
        // tp.y = -tp.y;
        y = -y;

        //let v = b2Add(b2MulSV(scale, tp), c);
        const vX = (scale * x) + cX;
        const vY = (scale * y) + cY;
    
        // Draw the point as a circle
        ctx.beginPath();
        ctx.arc(vX, vY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
    
        // Add a stroke to the circle
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.lineWidth = 1;  // You can adjust this value as needed
        ctx.stroke();
    };

    draw.SetPosition = function(x, y) {
        // use half width and height to make the virtual 'camera' look at (x, y)
        draw.positionOffset.x = wide / 2 - x;
        draw.positionOffset.y = y - high / 2;
    }

    draw.context = ctx;
    
    return draw;
}

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
export function RAF(callback)
{
    let lastTime = 0;
    let totalTime = 0;

    let frameCount = 0;
    let lastFpsUpdateTime = 0;
    let currentFps = 0;

    function update(currentTime)
    {
        requestAnimationFrame(update);

        if (lastTime === 0) {
            lastTime = currentTime;
        }
        const deltaTime = Math.min((currentTime - lastTime) / 1000, 1 / 10);
        lastTime = currentTime;
        totalTime += deltaTime;

        callback(deltaTime, totalTime, currentFps);

        frameCount++;
        if (currentTime - lastFpsUpdateTime >= 1000) {
            currentFps = Math.round((frameCount * 1000) / (currentTime - lastFpsUpdateTime));
            frameCount = 0;
            lastFpsUpdateTime = currentTime;
        }
    }

    requestAnimationFrame(update);
}

/**
 *
 * IMAGE HELPERS
 * 
 */
function loadPNGImage(imageUrl)
{
    return new Promise((resolve, reject) =>
    {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (event) =>
        {
            const errorDetails = {
                message: 'Failed to load image',
                url: imageUrl,
                event: event
            };
            reject(new Error(JSON.stringify(errorDetails, null, 2)));
        };
        img.src = imageUrl;
    });
}

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
export function AttachImage(worldId, bodyId, path, imgName, drawOffset = null, drawScale = null, sourcePosition = null, sourceSize = null)
{
    const world = b2GetWorldFromId(worldId);
    const shapes = [];
    b2Body_GetShapes(bodyId, shapes);
    const shape = world.shapeArray[shapes[shapes.length - 1].index1 - 1];
    shape.imageOffset = drawOffset;
    shape.imageScale = drawScale;
    shape.imageRect = new b2AABB(sourcePosition.x, sourcePosition.y, sourceSize.x, sourceSize.y);
    // assume images are in 'images' folder and one level up
    const fullPath = path + "/" + imgName;
    loadPNGImage(fullPath)
        .then((loadedImage) =>
        {
            shape.image = loadedImage;
        })
        .catch((error) =>
        {
            console.error('Error loading local image:', error);
        });
    return shape;
}

/**
 * 
 * UI HELPERS
 * 
 */
function getMousePosUV(canvas, ps)
{
    const rect = canvas.getBoundingClientRect();

    return {
        u: (ps.x - rect.left) / rect.width,
        v: 1.0 - (ps.y - rect.top) / rect.height
    };
}

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
export function ConvertScreenToWorld(canvas, drawScale, ps)
{
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    let uv = getMousePosUV(canvas, ps);
    var ratio = w / h;
    var center = new b2Vec2(0, 0);      // could be scroll position if there's a camera
    var zoom = (h / 2) / drawScale;

    // calculate the screen extents
    var extents = new b2Vec2(zoom * ratio, zoom);
    var lower = b2Sub(center, extents);
    var upper = b2Add(center, extents);

    // convert u,v to world point
    var pw = new b2Vec2((1 - uv.u) * lower.x + uv.u * upper.x, (1 - uv.v) * lower.y + uv.v * upper.y);
    return pw;
}

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
export function ConvertWorldToScreen(canvas, drawScale, pw)
{
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    
    var ratio = w / h;
    var center = new b2Vec2(0, 0);
    var zoom = (h / 2) / drawScale;

    // calculate the screen extents
    var extents = new b2Vec2(zoom * ratio, zoom);
    var lower = b2Sub(center, extents);
    var upper = b2Add(center, extents);
    
    // convert world point to u,v coordinates
    var u = (pw.x - lower.x) / (upper.x - lower.x);
    var v = (pw.y - lower.y) / (upper.y - lower.y);
    
    // convert u,v to screen coordinates
    var ps = new b2Vec2(u * w, v * h);
    return ps;
}
