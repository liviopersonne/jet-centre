import { EMPTY_STRING, required } from '@/lib/zodExtends';
import { z } from 'zod';

export const zContact = z.object({
    firstName: z.string(),
    lastName: z.string(),
    job: z.string(),
    id: z.string()
});

export type Contact = z.infer<typeof zContact>;
export const emptyContact: Contact = {
    firstName: '',
    lastName: '',
    job: '',
    id: ''
};

// ~~~~~~~~~~~ Contact Creation ~~~~~~~~~~ //
export const contactCreationSchema = z.object({
    firstName: z.string().superRefine(required),
    lastName: z.string().superRefine(required),
    email: z.string().email(),
    tel: z.string().or(EMPTY_STRING),
    description: z.string(),
    job: z.string()
});

export type ContactCreationSchema = z.infer<typeof contactCreationSchema>;
export const emptyContactCreationSchema: ContactCreationSchema = {
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    description: '',
    job: ''
};

// ~~~~~~~~~~ Contact Form Value ~~~~~~~~~ //
export const zNewContact = contactCreationSchema.merge(
    z.object({ id: z.string(), isNew: z.object({}) })
);
export type NewContact = z.infer<typeof zNewContact>;

export const zContactFormValue = zNewContact.or(zContact);
export type ContactFormValue = z.infer<typeof zContactFormValue>;

export const contactSchema = z.object({
    contact: zContactFormValue.array().nonempty()
});

export type ContactSchema = z.infer<typeof contactSchema>;
export const emptyContactSchema = {
    contact: []
};
