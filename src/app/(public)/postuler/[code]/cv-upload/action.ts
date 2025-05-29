'use server';

import { writeFile } from 'fs/promises';
import { join } from 'path';

export const submitCV = async (id: string, name: string, data: FormData) => {
    console.log('Starting upload...');

    const file: File | null = data.get('file') as File;
    if (!file) {
        throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const path = join(process.cwd(), 'data', 'cv', `${id}_${name}_${file.name}.pdf`);
    await writeFile(path, buffer);
    console.log(`open ${path} to see the uploaded file`);
};
