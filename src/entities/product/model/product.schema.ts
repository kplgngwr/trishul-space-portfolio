import { z } from 'zod';

/**
 * Product Entity Schema
 * @description Zod schema for product validation with inferred types
 */

export const productSpecSchema = z.object({
    label: z.string().min(1, 'Spec label is required'),
    value: z.string().min(1, 'Spec value is required'),
});

export const productSchema = z.object({
    id: z.string().min(1, 'Product ID is required'),
    name: z.string().min(1, 'Product name is required'),
    subtitle: z.string().min(1, 'Product subtitle is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    specs: z.array(productSpecSchema).min(1, 'At least one spec is required'),
    image: z.string().refine(
        (val) => val.startsWith('/') || val.startsWith('http'),
        'Image must be an absolute path or URL'
    ),
    video: z.string().refine(
        (val) => val.startsWith('/') || val.startsWith('http'),
        'Video must be an absolute path or URL'
    ).optional(),
    ignitorVideo: z.string().refine(
        (val) => val.startsWith('/') || val.startsWith('http'),
        'Ignitor video must be an absolute path or URL'
    ).optional(),
    isUnderDevelopment: z.boolean().optional(),
});

export const productsSchema = z.array(productSchema);

// Inferred types from Zod schemas - NO DUPLICATION
export type ProductSpec = z.infer<typeof productSpecSchema>;
export type Product = z.infer<typeof productSchema>;
export type Products = z.infer<typeof productsSchema>;
