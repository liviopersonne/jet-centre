"use client";

import Link from 'next/link';
import { ReactNode, forwardRef } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { FaGripLines } from 'react-icons/fa';
import AnimateHeight from 'react-animate-height';
import { ANIMATION_DURATION_MS } from '@/settings/vars';

export const Box = forwardRef<
    HTMLDivElement,
    { children: ReactNode; className?: string | string[] } & Omit<any, 'children' | 'className'>
>(({ children, className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('rounded-xl bg-box-background flex flex-col overflow-auto', className)}
        {...props}
    >
        {children}
    </div>
));

export const BoxHeader = ({ children }: { children?: ReactNode }) => (
    <div className="bg-box-title flex justify-between items-center p-2">{children}</div>
);

export const BoxHeaderBlock = ({ children }: { children?: ReactNode }) => (
    <div className="flex justify-between items-center gap-2">{children}</div>
);

export const BoxContent = ({ children, collapse }: { children: ReactNode; collapse?: boolean }) => (
    <AnimateHeight height={collapse ? 0 : 'auto'} duration={ANIMATION_DURATION_MS}>
        <div className={'p-2'}>{children}</div>
    </AnimateHeight>
);

export const BoxLink = ({ children, href }: { children: string | string[]; href: string }) => (
    <Button variant="link" className="px-0 py-0 h-fit text-link">
        <Link href={href}>{children}</Link>
    </Button>
);

export const BoxTitle = ({ children }: { children: string | string[] }) => (
    <h3 className="font-semibold">{children}</h3>
);

export const BoxDragHandle = forwardRef<HTMLDivElement>((props, ref) => (
    <div className="h-6 w-6 content-center" ref={ref} {...props}>
        <FaGripLines />
    </div>
));

export const BoxCollapseButton = ({
    collapse,
    setCollapse,
}: {
    collapse: boolean;
    setCollapse: (c: boolean) => void;
}) => {
    function toggleCollapse() {
        setCollapse(!collapse);
    }

    return (
        <Button
            onClick={toggleCollapse}
            variant="default"
            className="px-0 py-0 h-6 w-6 bg-transparent hover:bg-transparent"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                {collapse ? (
                    <>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M 7 6.5 l 5 -5 5 5"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M 17 17.5 l -5 5 -5 -5"
                        />
                    </>
                ) : (
                    // Les flèches sont décalées de 0.5px pour compenser les illusions d'optique dues à l’œil humain
                    // See: http://designwithfontforge.com/en-US/Trusting_Your_Eyes.html#perceived-height
                    <>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M 17 2 l -5 5 -5 -5"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M 7 22 l 5 -5 5 5"
                        />
                    </>
                )}
            </svg>
        </Button>
    );
};
