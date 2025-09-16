'use server';

import { ExtendedPosition } from '@/data/positions';
import prisma from '@/db';

/**
 * Function to fetch the different mission of a CDP.
 *
 * @export
 * @param {(string | undefined)} email of the user
 * @return {{ missions: string[]; position: string }} the list of codes of the missions (e.g. [224AE, 224028]) and the position (e.g. "Trésorier" or "Chargée template")
 */
export async function get_user_sidebar_info(name: {
    firstName: string;
    lastName: string;
}): Promise<{ missions: string[]; position: ExtendedPosition } | undefined> {
    try {
        const person = await prisma.person.findUnique({
            where: { name: { firstName: name.firstName, lastName: name.lastName } },
            include: {
                user: {
                    include: {
                        admin: {
                            include: {
                                studies: {
                                    include: {
                                        information: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        const admin = person?.user?.admin;
        if (!admin) {
            return;
        }
        const missions = admin.studies.map((study) => study.information.code) || [];
        const position = admin.position || 'Non défini';
        return { missions, position };
    } catch (e) {
        console.error('[get_user_missions] Prisma error: \n', e);
    }
}
