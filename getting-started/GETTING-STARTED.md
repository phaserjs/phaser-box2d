# Phaser Box2D Getting Started Guide

![Phaser Box2D Logo](../phaser-box2d-logo.png)

## Downloading Phaser Box2D

Checkout the [Phaser Box2D GitHub repository](https://github.com/phaserjs/phaser-box2d).

Inside the `dist` folder you will find the following 4 files:

### `PhaserBox2D-Debug.js` + `PhaserBox2D-Debug.js.map` (the Debug build)

This is the **debug** build of Phaser Box2D. It includes lots of `console.asset` statements to aid with debugging. It also includes the crude but functional Canvas debug renderer built-in.

**You should not use this version for production.**

The assertion statements have a significant impact on performance. And the debug renderer is most certainly not meant for final games. The included source map file also aids in debugging.

### `PhaserBox2D.js` + `PhaserBox2D.min.js` (the Release build)

This is the **release** build of Phaser Box2D. All of the assertions and debug calls have been stripped out. Also, the debug renderer has been removed to help save on space. Use this version when building the release version of your game. You can also use it during development, however sometimes you may need to swap to the Debug version in order to more easily trace any physics related issues.

For the sake of this guide, we will be using the Debug Build of Phaser Box2D. However, you should swap to using the Release build for any game you want to take to production, to gain extra performance and shave some bytes off the file size.

## Learning Resources

There are 4 key places to learn how to use Phaser Box2D.

### 1. The Examples

We've provided a wide range of examples and we will keep adding to these in the coming months. They are split between using the Debug renderer and using Phaser as the game framework. The code is very similar between them both. The difference is that we've provided a thin set of helper functions for Phaser to remove the more common tasks. However, you don't need to use them - and we will cover how to integrate Box2D directly below.

Follow the instructions in the README for getting the Examples running. Browse through them, experiment, play and pull the code apart.

### 2. API Documentation

You'll quickly notice that Box2D consists of lots of functions, all started `b2`. We have created our own API Docs that provides information for all of the core Box2D functions. It's a good idea to have these open alongside the Examples, so you can see how a function is used in the code and cross-reference the parameters in the API Docs. What the API Docs will _not_ do is teach you how to use Box2D. They are purely documentation for the functions and classes and should be treated as such.

### 3. The Official Box2D Documentation

The official Box2D site itself has some excellent documentation available: https://box2d.org/documentation/

We strongly recommend you start with the [Core Concepts](https://box2d.org/documentation/index.html#autotoc_md4) and [Units](https://box2d.org/documentation/index.html#autotoc_md18) sections first.

If you're not familiar with the concept of a physics engine working in meters and kilograms as its units of measurement, then you need to pay careful attention to this, or you can quickly create simulations that are utterly impractical from a physics sense.

One thing you will start to appreciate is that because we carefully kept all of the exact same b2 function names in our conversion, the official docs map to them almost perfectly in most cases. Where there are deviations, please consult our API Docs for details.

### 4. Box2D Tutorials

The final resource is a wide range of Box2D tutorials published on the Phaser site:

#### Start Here

* [Bodies](https://phaser.io/tutorials/box2d-tutorials/bodies)
* [World Settings](https://phaser.io/tutorials/box2d-tutorials/world-settings)
* [Forces and Impulses](https://phaser.io/tutorials/box2d-tutorials/forces-and-impulses)
* [Custom Gravity](https://phaser.io/tutorials/box2d-tutorials/custom-gravity)
* [Moving at a constant speed](https://phaser.io/tutorials/box2d-tutorials/moving-at-constant-speed)
* [Rotating to a given angle](https://phaser.io/tutorials/box2d-tutorials/rotate-to-angle)
* [Jumping](https://phaser.io/tutorials/box2d-tutorials/jumping)
* [Using Debug Draw](https://phaser.io/tutorials/box2d-tutorials/using-draw-debug)
* [User Data](https://phaser.io/tutorials/box2d-tutorials/user-data)
* [Anatomy of a collision](https://phaser.io/tutorials/box2d-tutorials/anatomy-of-a-collision)
* [Collision Callbacks](https://phaser.io/tutorials/box2d-tutorials/collision-callbacks)
* [Collision Filtering](https://phaser.io/tutorials/box2d-tutorials/collision-filtering)
* [Sensors](https://phaser.io/tutorials/box2d-tutorials/sensors)
* [Ray Casting](https://phaser.io/tutorials/box2d-tutorials/ray-casting)
* [World Querying](https://phaser.io/tutorials/box2d-tutorials/world-querying)
* [Removing Bodies Safely](https://phaser.io/tutorials/box2d-tutorials/removing-bodies-safely)
* [The 'Can I Jump?' Question](https://phaser.io/tutorials/box2d-tutorials/can-i-jump)
* [Ghost Vertices](https://phaser.io/tutorials/box2d-tutorials/ghost-vertices)
* [Joints - Overview](https://phaser.io/tutorials/box2d-tutorials/an-overview-of-joints)
* [Joints - Revolute](https://phaser.io/tutorials/box2d-tutorials/revolute-joints)
* [Joints - Prismatic](https://phaser.io/tutorials/box2d-tutorials/prismatic-joints)
* [FAQ / Gotchas](https://phaser.io/tutorials/box2d-tutorials/faq-gotchas)

#### Advanced Topics

Do not attempt these until you've at least read the above and have a few pieces of your own code under your belt!

* [Projected Trajectory](https://phaser.io/tutorials/box2d-tutorials/projected-trajectories)
* [Sticky Projectiles](https://phaser.io/tutorials/box2d-tutorials/sticky-projectiles)
* [Hovercar Suspension](https://phaser.io/tutorials/box2d-tutorials/hovercar-suspension)
* [Top-down Car Physics](https://phaser.io/tutorials/box2d-tutorials/top-down-car-physics)
* [One-way Walls](https://phaser.io/tutorials/box2d-tutorials/one-way-walls)
* [Buoyancy](https://phaser.io/tutorials/box2d-tutorials/buoyancy)
* [Explosions](https://phaser.io/tutorials/box2d-tutorials/explosions)
* [Physics-driven Particles](https://phaser.io/tutorials/box2d-tutorials/introduction-to-particles)

### Other Resources

If you think you've found a bug, or have a feature request, then you can open it in the [GitHub Issues](https://github.com/phaserjs/phaser-box2d/issues)

You can also ask questions in the `box2d` channel in the [Phaser Discord](https://discord.gg/phaser)

And finally, if you're a Phaser Pro or Enterprise customer, you can email [mailto:support@phaser.io](support@phaser.io) for priority support.

## A Quick Debug Draw Example

In this section we'll cover creating a simple example using the built-in Debug Draw renderer.

First, start by making an html file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phaser Box2D Example</title>
</head>
<body>
    <div id="canvas-container">
        <canvas id="myCanvas"></canvas>
    </div>
    <script type="module" src="main.js"></script>
</body>
</html>
```

Now create `main.js` in the same location. In this example we're going to make a Box2D World. Into this world we'll add a static rectangular body that will act as our ground. Onto this, we will drop two dynamic bodies: a box and a circle.

To create our world we need to construct a definition for it. The world definition holds some core simulation related values, such as gravity, the contact damping ratio, if sleep mode should be enabled or not, and more.

Box2D uses the `b2DefaultWorldDef` function to create the definition:

```js
import { CreateWorld, b2DefaultWorldDef, b2Vec2 } from '../lib/PhaserBox2D.js';

// create a definition for a world using the default values
let worldDef = b2DefaultWorldDef();

// change some of the default values
worldDef.gravity = new b2Vec2(0, -10);

// create a world object and save the ID which will access it
let world = CreateWorld({ worldDef: worldDef });
```

Here we import the required functions. We're going to give our world gravity, so this is set as a `b2Vec2` with a y value of -10 and finally we pass the definition to `CreateWorld`.

Now we have a physics world, but it's empty. Let's make the ground:

```js
import { b2DefaultBodyDef, b2Rot, CreateBoxPolygon, b2BodyType, b2HexColor } from '../lib/PhaserBox2D.js';

const groundBodyDef = b2DefaultBodyDef();

groundBodyDef.rotation = new b2Rot(Math.cos(Math.PI * .03), Math.sin(Math.PI * .03));

const ground = CreateBoxPolygon({
    worldId: world.worldId,
    type: b2BodyType.b2_staticBody,
    bodyDef: groundBodyDef,
    position: new b2Vec2(0, -6),
    size: new b2Vec2(20, 1),
    density: 1.0,
    friction: 0.5,
    color: b2HexColor.b2_colorLawnGreen
});
```

This code works in a very similar way to creating the world. First, you make a definition - this time it's a Body Definition. Then, you adjust any of the definition properties. Here, we're setting the rotation of the body to be slightly sloped up and towards the right. This will allow the dynamic bodies we create to land on it and slide off.

Rotation in Box2D is handled via the `b2Rot` function, which takes two parameters `c` for cosine and `s` for sine.

Finally, with the definition set we make a Box Polygon (basically, a rectangle). All bodies in Box2D are linked to the World via the World ID, not the world instance itself. So get used to passing the `worldId` value around.

We've set the `type` to be a `b2_staticBody`. In other words, we don't want this body to move, ever.

Then we set the size and position of it the body. Again, remember that we're working in MKS units here, not pixels. The Phaser functions have some helpers for you that will automatically convert to and from pixels, but for this example it's best to show you the way that Box2D natively handles it internally.

Finally we set the density and friction to values that will allow the other bodies to 'slide' down our ground and then give the ground a debug color. Box2D has a bunch of named colors built into it, named like CSS colors. We've picked 'lawn green' for this and our Debug renderer will use that when drawing it.

With the ground in place let's add two dynamic bodies:

```js
const box = CreateBoxPolygon({
    worldId: world.worldId,
    type: b2BodyType.b2_dynamicBody,
    position: new b2Vec2(0, 8),
    size: 2,
    density: 1.0,
    friction: 0.2,
    color: b2HexColor.b2_colorGold
});

const ball = CreateCircle({
    worldId: world.worldId,
    type: b2BodyType.b2_dynamicBody,
    position: new b2Vec2(1.7, 12),
    radius: 1,
    density: 1.0,
    friction: 0.5,
    color:b2HexColor.b2_colorRed
});
```

By now this approach should be getting familiar to you. Here we've a Box Polygon that is gold in color, positioned at the top middle of our world. It has a size of 2. Unlike the ground, because only one value was given it will be a square shape.

The Circle works in the same way, except it has a radius and is red.

With the two bodies in our world, we need to update the simulation to get them to move, plus render them. For this, we'll use an `update` function, called by RequestAnimationFrame:

```js
function update (deltaTime)
{
	WorldStep({ worldId: world.worldId, deltaTime: deltaTime });

	ctx.clearRect(0, 0, canvas.width, canvas.height);

    b2World_Draw(world.worldId, m_draw);
}
```

There's only two parts to this. `WorldStep`, as the name implies, will 'step' the given Box2D world simulation forward by 'deltaTime' amount. As you can see, you pass in the World ID, not the world itself. Box2D is perfectly capable of running multiple worlds at once. Each will need stepping, although they can step at different rates as required.

The Debug Draw renderer has a built-in `RAF` function that calculates the delta time and calls the `update` function for you. You don't have to use it, though. All you need to know is that the `deltaTime` value is the amount you want to step the world by. This should be a fixed number and is typically 1/60. See the [b2World_Step](https://box2d.org/documentation/group__world.html#ga0249cf75273319ca548d55734d7297c4) function for details if you wish to implement your own.

The final call here is to `b2World_Draw`. The C version of Box2D actually has its own built-in Debug renderer. Obviously, we couldn't use that for the web, so we wrote our own in JavaScript that used the same function signatures, hence how we're able to pass it through in here. In the above code, `m_draw` is:

```js
m_draw = CreateDebugDraw(canvas, ctx, m_drawScale);
```

Which just takes a canvas, context and a scale and then creates the Debug renderer from them. But it's the `b2World_Draw` function that actually renders all of the bodies, joints, etc to it.

By calling `RAF(update)` it will start the request animation frame timer, calculate the delta time and pass it to `update` in a loop. The resulting combination renders the Box2D simulation in browser, so you can see the box and circle fall down onto the ground and slide happily off.

Run the given Example called "Simple" to see this all in action.

Although we've only touched on the surface of what Box2D can do here, you should already start to have an appreciation for how its structured. You create and modify definitions, which are used to construct worlds or geometry, and those are in turn added to the world which is stepped and drawn.

## A Quick Phaser Example

In this example we will re-create the Debug Draw Example above, but we'll do it using Phaser instead and some of its helper functions.

First, let's start with a blank Phaser Scene and game config:

```js
import * as Phaser from '../lib/phaser.esm.js';

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
    }

    update (time, delta)
    {
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: Example
};

const game = new Phaser.Game(config);
```

This should be very familiar to you if you've any experience with Phaser.

In this example, we'll use the Phaser Graphics Game Object to render our world. In the next one, we'll use Sprites.

First, we need to set the world scale. This is the conversion from pixels to meters: `SetWorldScale(40)`. Then we'll add a Graphics Game Object to render in and create our world. Add this code inside the `create` method:

```js
SetWorldScale(40);

const debug = this.add.graphics();

const world = CreateWorld({ worldDef: b2DefaultWorldDef() });

const worldId = world.worldId;
```

Now we need our ground:

```js
const groundBodyDef = b2DefaultBodyDef();

groundBodyDef.rotation = RotFromRad(-0.06);

CreateBoxPolygon({
    worldId,
    type: STATIC,
    bodyDef: groundBodyDef,
    position: pxmVec2(640, -600),
    size: new b2Vec2(20, 1),
    density: 1.0,
    friction: 0.5,
    color: b2HexColor.b2_colorLawnGreen
});
```

This is very similar to the previous example. The difference is that here we take advantage of the `RotFromRad` helper function and pass it a value of `-0.06` radians for the rotation. Internally, this will create the `b2Rot` that Box2D needs.

You'll also notice we're using the helper function `pxmVec2`. This converts from pixels to meters and returns a `b2Vec2`, which is what `position` requires. In this case, we're asking it to set the position to be 640 x -600 pixels. The position is the center of the object and our world size is 1280 x 720. The other values are the same as before.

Now it's time for the box and the circle:

```js
CreateBoxPolygon({
    worldId,
    type: DYNAMIC,
    position: pxmVec2(630, 64),
    size: 1,
    density: 1.0,
    friction: 0.2,
    color: b2HexColor.b2_colorGold
});

CreateCircle({
    worldId,
    type: DYNAMIC,
    position: pxmVec2(690, 0),
    radius: 1,
    density: 1.0,
    friction: 0.5,
    color: b2HexColor.b2_colorRed
});
```

Here you can see that again we're taking advantage of the `pxmVec2` function so that we can position our bodies using pixel coordinates. Aside from this, it's business as usual for the rest of the values.

The final thing to do is create the Graphics debug draw:

```js
this.worldDraw = new PhaserDebugDraw(debug, 1280, 720, GetWorldScale());
```

and hook it all together in our `update` method:

```js
update (time, delta)
{
    const worldId = this.world.worldId;

    WorldStep({ worldId, deltaTime: delta });

    this.debug.clear();

    b2World_Draw(worldId, this.worldDraw);
}
```

We extract the `worldId` because we're going to be using it, we step the world, clear the Graphics object and re-render the bodies to it.

Run the given Phaser Example called "Simple Example" to see this running (with an added capsule shape, too)

## A Quick Phaser Sprite Example

Debug Draw is all good and well, but for a game you need something graphically stronger.

For that, we've created some helper functions such as `SpriteToBox` and `AddSpriteToWorld`. Here's a short explanation of how they work.

First, let's create a regular Phaser sprite:

```js
const platform = this.add.sprite(640, 600, 'platform').setRotation(0.06).setScale(1.5);
```

Here we've got a platform positioned at 640x600. It has been rotated slightly and scaled up.

We can convert this Sprite into a Body:

```js
SpriteToBox(worldId, platform, {
    type: STATIC,
    friction: 0.1
});
```

This function will read the properties from the Phaser sprite and then create a static Box Polygon from them, with friction set at 0.1. Previously, where we had to set rotation, position and size, this is all taken care of for you.

But what if you want to use a Dynamic Body for a Sprite? So it can move unlike our platform above?

Again, you can use the same approach, but this time we'll add the sprite to the world:

```js
const block = this.add.sprite(640, 90, 'block');

const box = SpriteToBox(worldId, block, {
    restitution: 0.7,
    friction: 0.1
});

AddSpriteToWorld(worldId, block, box);
```

We've a Sprite, which we have passed to `SpriteToBox` to create a Box Polygon from. This one has `restitution` of 0.7, which means it will be bouncy when it lands on the ground.

What is new here is the call to `AddSpriteToWorld`. This takes a World ID, a sprite (`block`) and a body (`box`) and links them together.

Then, inside of the `update` method, you call:

```js
UpdateWorldSprites(worldId);
```

Do this after the World Step.

What this does, is check through an internal Map of 'sprites to bodies' and it will sync the body position and rotation back to the sprite to which it is bound.

Of course, any force or impulse you apply to the body will be set on the sprite. For example, if you wanted to allow the Body to be moved by the cursor keys, you would impart those forces on the body - and then let the `UpdateWorldSprites` call sync it back. The Sprite could still be running an animation, for example, or tweening its alpha or tint, but the two will remain locked together.

What you need to consider is if you want to move the Sprite. Movement should be done via the Body, not the Sprite itself. Or, you can unlock the pairing via the `RemoveSpriteFromWorld` function, tween the sprite, then hook them back together again. Just bear in mind that the body will remain active and simulating within the world during this time.
