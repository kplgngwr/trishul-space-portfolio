import { productsSchema, type Products } from './product.schema';

/**
 * Product Data
 * @description Statically validated product data
 *
 * - `variants[].specs` → features that differ per variant (first one is the headline metric)
 * - `specs`            → details common to all variants
 * - `image`            → only for products without variants
 */

const rawProducts = [
    {
        id: 'harpy',
        name: 'Harpy-1',
        subtitle: 'Production Engine',
        description:
            'A next-generation cryogenic rocket engine designed for high efficiency, reusability, and reliability — enabling high-performance propulsion with seamless integration into modern launch vehicles.',
        variants: [
            {
                key: 'ground',
                label: 'Ground Level',
                image: '/products/harpy-1-Ground.png',
                specs: [{ label: 'Nominal Thrust', value: '30 kN' }],
            },
            {
                key: 'vacuum',
                label: 'Vacuum Level',
                image: '/products/harpy-1-Vacuum.png',
                specs: [{ label: 'Nominal Thrust', value: '37 kN' }],
            },
        ],
        specs: [
            { label: 'Propellant', value: 'LOX / LNG' },
            { label: 'Cycle Type', value: 'Fuel-Rich Staged Combustion' },
            // { label: 'Specific Impulse', value: '345 s' },
            // { label: 'Burn Duration', value: '700 s' },
        ],
        // image: N.A. — each variant provides its own image
        isUnderDevelopment: true,
    },
] as const;

// Validate at runtime - will throw if data is malformed
export const products: Products = productsSchema.parse(rawProducts);
