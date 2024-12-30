/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2BodyType, b2DefaultBodyDef, b2DefaultShapeDef } from "./include/types_h.js";
import { b2Body_ApplyForceToCenter, b2Body_SetUserData, b2CreateBody, b2DestroyBody } from "./include/body_h.js";
import { b2CreateCircleShape, b2CreatePolygonShape } from "./include/shape_h.js";
import { b2CreateRevoluteJoint, b2DefaultRevoluteJointDef } from "./include/joint_h.js";

import { b2Circle } from "./include/collision_h.js";
import { b2MakeBox } from "./include/geometry_h.js";
import { b2Vec2 } from "./include/math_functions_h.js";

function approx(value, variation)
{
    return value + (Math.random() - 0.5) * variation;
}

export class ActiveBall
{
    constructor(id, createdTime)
    {
        this.id = id;
        this.created = createdTime;
    }
}

function shootBall(startPosition, startForce, radius, density, color, worldId)
{
    const bodyDefBall = b2DefaultBodyDef();
    bodyDefBall.type = b2BodyType.b2_dynamicBody;
    bodyDefBall.fixedRotation = false;
    bodyDefBall.position = startPosition.clone();

    const shapeDefBall = b2DefaultShapeDef();
    shapeDefBall.density = density;
    shapeDefBall.friction = 0.05;
    shapeDefBall.restitution = 0.5;
    shapeDefBall.customColor = color;

    const ballId = b2CreateBody(worldId, bodyDefBall);
    const ball = new b2Circle();
    ball.center = new b2Vec2(0, 0);
    ball.radius = radius;
    b2CreateCircleShape(ballId, shapeDefBall, ball);

    const force = new b2Vec2(approx(startForce.x, 400), approx(startForce.y, 1500));
    b2Body_ApplyForceToCenter(ballId, force, true);

    return ballId;
}

export class Gun
{
    constructor(position, power, frequency, life, radius, density, color, worldId)
    {
        this.worldId = worldId;
        this.position = position;
        this.power = power;
        this.frequency = frequency;
        this.life = life;
        this.radius = radius;
        this.density = density;
        this.color = color;

        this.activeBalls = [];
        this.nextShotTime = this.frequency;
        this.totalTime = 0;
    }

    update(dt)
    {
        if (isNaN(dt)) { return; }
        this.totalTime += dt;

        // shoot when it's time
        this.nextShotTime -= dt;

        if (this.nextShotTime <= 0)
        {
            this.nextShotTime = Math.max(this.nextShotTime + this.frequency, 1/240);
            const ballId = shootBall(this.position, this.power, this.radius, this.density, this.color, this.worldId);
            const ab = new ActiveBall( ballId, this.totalTime );
            this.activeBalls.push(ab);
            b2Body_SetUserData(ballId, ab);
        }

        // kill old balls
        for (let i = this.activeBalls.length - 1; i >= 0; --i)
        {
            const ab = this.activeBalls[i];

            if (this.totalTime - ab.created >= this.life)
            {
                this.destroyBall(ab);
            }
        }
    }

    destroyBall(ab)
    {
        const i = this.activeBalls.indexOf(ab);

        if (i != -1)
        {
            b2DestroyBody(ab.id);
            this.activeBalls.splice(i, 1);

            return true;
        }

        return false;
    }
}

export class Spinner
{
    constructor(position, torque, speed, color, size = 1.0, worldId)
    {
        // centre circle, static
        const bodyDefBall = b2DefaultBodyDef();
        bodyDefBall.type = b2BodyType.b2_staticBody;
        bodyDefBall.position = position;
    
        const ballId = b2CreateBody(worldId, bodyDefBall);
        const ball = new b2Circle();
        ball.center = new b2Vec2(0, 0);
        ball.radius = 2.0 * size;
        const shapeDefBall = b2DefaultShapeDef();
        shapeDefBall.density = 1.0;
        shapeDefBall.friction = 0.05;
        shapeDefBall.filter.maskBits = 0x00000000;
        shapeDefBall.customColor = color;
        b2CreateCircleShape(ballId, shapeDefBall, ball);

        // paddle, fixed to circle with a revolute joint
        const paddleDef = b2DefaultBodyDef();
        paddleDef.type = b2BodyType.b2_dynamicBody;
        paddleDef.position = position;
        paddleDef.fixedRotation = false;
        const boxId = b2CreateBody(worldId, paddleDef);
        const dynamicBox = b2MakeBox(12 * size, 0.5 * size);
        const shapeDefBox = b2DefaultShapeDef();
        shapeDefBox.density = 5.0;
        shapeDefBox.friction = 1.0;
        shapeDefBox.customColor = color;
        b2CreatePolygonShape(boxId, shapeDefBox, dynamicBox);
    
        const jointDef = b2DefaultRevoluteJointDef();
        jointDef.bodyIdA = boxId;
        jointDef.bodyIdB = ballId;
        jointDef.localAnchorA = new b2Vec2(0, 0);
        jointDef.localAnchorB = new b2Vec2(0, 0);   // position;
        jointDef.enableMotor = true;
        jointDef.motorSpeed = speed;
        jointDef.maxMotorTorque = torque;
        b2CreateRevoluteJoint(worldId, jointDef);
    }
}
