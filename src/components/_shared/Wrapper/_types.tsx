import { ReactNode } from 'react';

export default interface WrapperInterface {
    children: ReactNode;
    className?: string;
    backgroundColor?: string;
}