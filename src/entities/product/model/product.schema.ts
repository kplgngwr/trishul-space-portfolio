import { z } from 'zod';

/**
 * Product Entity Schema
 * @description Zod schema for product validation with inferred types
 */

const assetPathSchema = (field: string) =>
    z.string().refine(
        (val) => val.startsWith('/') || val.startsWith('http'),
        `${field} must be an absolute path or URL`
    );

export const productSpecSchema = z.object({
    label: z.string().min(1, 'Spec label is required'),
    value: z.string().min(1, 'Spec value is required'),
});

/** A product configuration - carries its own image and the specs that set it apart */
export const productVariantSchema = z.object({
    key: z.string().min(1, 'Variant key is required'),
    label: z.string().min(1, 'Variant label is required'),
    image: assetPathSchema('Variant image'),
    specs: z.array(productSpecSchema).min(1, 'At least one differentiating spec is required'),
});

export const productSchema = z
    .object({
        id: z.string().min(1, 'Product ID is required'),
        name: z.string().min(1, 'Product name is required'),
        subtitle: z.string().min(1, 'Product subtitle is required'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        variants: z.array(productVariantSchema).default([]),
        /** Specs shared by every variant */
        specs: z.array(productSpecSchema).min(1, 'At least one spec is required'),
        /** Only needed when the product has no variants - variants bring their own images */
        image: assetPathSchema('Image').optional(),
        isUnderDevelopment: z.boolean().optional(),
    })
    .refine((product) => product.image || product.variants.length > 0, {
        message: 'A product without variants must have an image',
        path: ['image'],
    });

export const productsSchema = z.array(productSchema);

// Inferred types from Zod schemas - NO DUPLICATION
export type ProductSpec = z.infer<typeof productSpecSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type Product = z.infer<typeof productSchema>;
export type Products = z.infer<typeof productsSchema>;
