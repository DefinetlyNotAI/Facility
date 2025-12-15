import * as React from "react";
import {type VariantProps} from 'class-variance-authority';
import {buttonVariants} from "@/components";

export interface VNTextRendererProps {
    text: string;
    onDone?: () => void;
}

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
