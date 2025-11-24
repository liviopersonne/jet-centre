import { AuthPosition } from '@/data/positions';
import { ROLES_SIDEBARS } from '@/settings/sidebars/sidebars';
import { RoleSideBar } from '@/settings/sidebars/types';

const ERROR_PREFIX = '/error/';
const AUTH_PREFIX = '/auth/';

export const MIDDLEWARE_ERRORS = {
    unauthorised: 'unauthorised',
    invalidPosition: 'invalid-position',
};

// See: https://github.com/Telecom-Etude/jet-centre/issues/215
const NON_AUTH_PUBLIC_ROUTE_PREFIXES = [ERROR_PREFIX];

export function isNonAuthPublicRoute(pathname: string) {
    for (const prefix of NON_AUTH_PUBLIC_ROUTE_PREFIXES)
        if (pathname.startsWith(prefix)) return true;

    return false;
}

export function isAuthorisedToRoute(pathname: string, position?: AuthPosition) {
    if (pathname === '/') return true;
    if (pathname.startsWith('/cdp/')) return true;
    if (!position) return false;
    if (!Object.keys(ROLES_SIDEBARS).includes(position)) return false;
    const sidebar: RoleSideBar = ROLES_SIDEBARS[position] as RoleSideBar;
    return sidebar.sidebar.find((section) =>
        section.items.find((item) => pathname.startsWith(item.href))
    );
}

export const ROUTES = {
    loginRedirect: '/',
    /* Error routes */
    unauthorised: ERROR_PREFIX + MIDDLEWARE_ERRORS.unauthorised,
    invalidPosition: ERROR_PREFIX + MIDDLEWARE_ERRORS.invalidPosition,
    /* Auth routes */
    signIn: AUTH_PREFIX + 'signin',
    signOut: AUTH_PREFIX + 'signout',
} as const;

export type StudyParams = { params: Promise<{ study: string }> };
