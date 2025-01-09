/**
 * This file includes code that is:
 *
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */
/**
 * @class b2Version
 * @summary Version numbering scheme. See https://semver.org/
 * @property {number} major - Significant changes
 * @property {number} minor - Incremental changes
 * @property {number} revision - Bug fixes
 */
export class b2Version {
    constructor(major?: number, minor?: number, revision?: number);
    major: number;
    minor: number;
    revision: number;
}
