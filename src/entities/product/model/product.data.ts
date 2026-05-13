import { productsSchema, type Products } from './product.schema';

/**
 * Product Data
 * @description Statically validated product data
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
                thrust: '30 kN',
                image: '/products/harpy-1-Ground.png',
            },
            {
                key: 'vacuum',
                label: 'Vacuum Level',
                thrust: '37 kN',
                image: '/products/harpy-1-Vacuum.png',
            },
        ],
        specs: [
            { label: 'Nominal Thrust (Vacuum)', value: '37 kN' },
            { label: 'Propellant', value: 'LOX / LNG' },
            { label: 'Cycle Type', value: 'Fuel-Rich Staged Combustion' },
            // { label: 'Specific Impulse', value: '345 s' },
            // { label: 'Burn Duration', value: '700 s' },
        ],
        image: '/updates/harpy-1.png',
        isUnderDevelopment: true,
    },
] as const;

// Validate at runtime - will throw if data is malformed
export const products: Products = productsSchema.parse(rawProducts);
