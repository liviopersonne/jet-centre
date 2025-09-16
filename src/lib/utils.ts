/**
 * A bunch of tools used widely across the codebase.
 *
 * @file utils.ts
 */

import { Address } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Function to merge multiple tailwind classname strings, in an intelligent
 * way (not just by concatenating the strings).
 *
 * @export
 * @function cn
 * @param {...ClassValue[]} inputs - classname strings to concatenate
 * @return {string} - the merged classname.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Non-breakable space
 *
 * See {@link https://github.com/johnridesabike/coronate/blob/master/src/HtmlEntities.res}
 * for the escape code's list for symbols in javascript.
 *
 * @constant
 * @type {string}
 */
export const NBSP: string = '\u00A0';

export function getProperty(obj: any, path: string) {
    return path.split('.').reduce((acc, key) => acc[key], obj);
}

export function arrayEqual<T>(
    lhs: T[],
    rhs: T[],
    equal: (lhs: T, rhs: T) => boolean = (lhs, rhs) => lhs === rhs
): boolean {
    if ((!lhs && rhs) || (lhs && !rhs)) return false;
    if (!lhs && !rhs) return true;
    if (lhs.length !== rhs.length) return false;
    for (let i = 0; i < lhs.length; ++i) {
        if (!equal(lhs[i], rhs[i])) return false;
    }
    return true;
}

/**
 * Reloads the window.
 *
 * This checks that the component is in the client-side version of the component.
 */
export function reloadWindow() {
    if (typeof window != 'undefined') location.reload();
}

interface PersonName {
    firstName: string;
    lastName: string;
}

/**
 * Returns a string with the full name of person
 */
export function personName({ firstName, lastName }: PersonName) {
    return firstName + ' ' + lastName;
}

/**
 * Returns a string with the full address, from an address database instance.
 */
export function stringifyAddress(address: Address): string {
    return (
        address.streetNumber +
        ' ' +
        address.streetName +
        ', ' +
        address.postalCode +
        ' ' +
        address.city +
        ', ' +
        address.country
    );
}
