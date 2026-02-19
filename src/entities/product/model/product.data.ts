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
            'A cryogenic liquid engine designed for small launch vehicles and in-space propulsion with seamless integration into modern stacks.',
        specs: [
            { label: 'Thrust (Vacuum)', value: '37 kN' },
            { label: 'Propellant', value: 'LOX / LNG' },
            { label: 'Cycle', value: 'Fuel rich staged combustion' },
            { label: 'Isp (Vacuum)', value: '348 s' },
        ],
        image: '/Harpy-1.png',
        ignitorVideo: '/Torch ignitor 1.mp4',
        isUnderDevelopment: true,
    },
    {
        id: 'sharv',
        name: 'Sharv-1',
        subtitle: 'Development Engine',
        description:
            'A green propellant demonstration engine operating on a pressure-fed cycle.',
        specs: [
            { label: 'Thrust', value: '5 kN' },
            { label: 'Propellant', value: 'Ethanol / Nitrous Oxide' },
            { label: 'Cycle', value: 'Pressure-fed' },
            { label: 'Isp (Vacuum)', value: '280 s' },
        ],
        image: '/sharv-1.jpg',
        video: '/Sharv.mp4',
    },
    {
        id: 'amulya',
        name: 'Amulya-1',
        subtitle: 'Prototype Engine',
        description:
            'A demonstration engine test validating nozzle performance.',
        specs: [
            { label: 'Thrust', value: '500 N' },
            { label: 'Propellant', value: 'Butane / Compressed Oxygen' },
        ],
        image: '/Amulya-1.png',
        video: '/Amulya.mp4',
    },
] as const;

// Validate at runtime - will throw if data is malformed
export const products: Products = productsSchema.parse(rawProducts);
