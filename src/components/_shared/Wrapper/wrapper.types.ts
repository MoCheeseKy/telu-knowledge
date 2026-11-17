import { ReactNode } from 'react';

/**
 * Properti untuk komponen {@link Wrapper}.
 */
export default interface WrapperInterface {
    children: ReactNode;
    className?: string;
    backgroundColor?: string;
}