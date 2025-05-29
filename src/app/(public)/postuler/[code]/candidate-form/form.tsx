'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CheckboxFormElement } from '@/components/meta-components/form/checkbox';
import { InputFormElement } from '@/components/meta-components/form/input';
import { TextAreaFormElement } from '@/components/meta-components/form/textarea';
import { Button } from '@/components/ui/button';
import { FormProvider } from '@/components/ui/form';

import { formQuestion, formSchema } from './form-questions';

export function CandidateForm({ formQuestions }: { formQuestions: formQuestion[] }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

    const questionToFormElement = (q: formQuestion) => {
        switch (q.type) {
            case 'singleLine':
                return <InputFormElement key={q.key} form={form} label={q.label} name={q.name} />;
            case 'multiline':
                return (
                    <TextAreaFormElement key={q.key} form={form} label={q.label} name={q.name} />
                );
            case 'checkbox':
                return (
                    <CheckboxFormElement key={q.key} form={form} label={q.label} name={q.name} />
                );
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-5">
                {formQuestions.map(questionToFormElement)}
                <Button type="submit">Submit</Button>
            </form>
        </FormProvider>
    );
}
