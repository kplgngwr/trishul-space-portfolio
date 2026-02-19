import { partnersSchema, type Partners } from './partner.schema';

/**
 * Partner Data
 */

const rawPartners = [
    {
        name: 'Indian Angel Network',
        logo: '/partners/IANfund.png',
        role: 'Lead Investor',
        url: 'https://www.indianangelnetwork.com/',
        isDark: false,
        categories: ['investor'],
    },
    {
        name: '8X Ventures',
        logo: '/partners/8xventures.jpg',
        role: 'Co-Investor',
        url: 'https://www.8xventures.com/',
        isDark: false,
        categories: ['investor'],
    },
    {
        name: 'ITEL',
        logo: '/partners/itel.png',
        role: 'Investor & Incubator Partner',
        url: 'https://www.itel.co.in/',
        isDark: false,
        categories: ['investor', 'incubator'],
    },
    {
        name: 'FITT',
        logo: '/partners/FITT.jpg',
        role: 'Incubation Partner',
        url: 'https://www.fitt.iitm.ac.in/',
        isDark: false,
        categories: ['incubator'],
    },
    {
        name: 'Boeing',
        logo: '/partners/boeing.jpg',
        role: 'Industry Partner',
        url: 'https://www.boeing.com/',
        categories: ['industry'],
    },
    {
        name: 'InSpace',
        logo: '/partners/inspace.jpg',
        role: 'Industry Partner',
        url: 'https://www.inspace.aero/',
        categories: ['industry'],
    },
    /* {
        name: 'ASACO',
        logo: '/partners/asaco.jpg',
        role: 'Industry Partner',
        url: 'https://www.asacoindia.com/',
        categories: ['industry'],
    }, */
    {
        name: 'HDFC Bank',
        logo: '/partners/hdfc.jpg',
        role: 'Industry Partner',
        url: 'https://www.hdfcbank.com/',
        categories: ['industry'],
    },
    {
        name: 'Think Gas',
        logo: '/partners/thinkgas.jpg',
        role: 'Industry Partner',
        url: 'https://thinkgas.in/',
        categories: ['industry'],
    },
    {
        name: 'Oil India',
        logo: '/partners/oil-india.jpg',
        role: 'Industry Partner',
        url: 'https://www.oil-india.com/',
        categories: ['industry'],
    },
] as const;

export const partners: Partners = partnersSchema.parse(rawPartners);
