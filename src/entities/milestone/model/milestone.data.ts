import { milestonesSchema, type Milestones } from './milestone.schema';
import { z } from 'zod';

/**
 * Milestone Data
 * @description Roadmap milestones with runtime validation
 */
const rawMilestones = [
    {
        id: 'amulya',
        date: 'Feb 2023',
        title: 'Amulya-1',
        description: 'Completed bench validation of a 500 N thrust demonstrator engine.',
        status: 'completed',
        specs: '500N · Gaseous Butane/O2',
    },
    {
        id: 'sponsorship',
        date: 'Mar 2023',
        title: 'Sponsorship Secured',
        description: 'Secured strategic sponsorships from Think Gas and Chandigarh University to support Sharv‑1 engine development.',
        status: 'completed',
        // specs: '5kN · Ethanol/N2O',
    },
    {
        id: 'sharv',
        date: 'Aug 2023',
        title: 'Sharv‑1 Test Campaign',
        description: 'Executed a comprehensive hot‑fire test campaign, achieving successful operation after 13 iterative test cycles.',
        status: 'completed',
        specs: '5kN · Ethanol/N2O',
    },
    {
        id: 'incorporation',
        date: 'Nov 2024',
        title: 'Company Incorporation',
        description: 'Formally incorporated as a Private Limited Company to commercialize propulsion technologies and scale operations.',
        status: 'completed',
        // specs: '',
    },
    {
        id: 'incubation_support',
        date: 'Jan 2025',
        title: 'Incubation & Mentorship',
        description: 'Incubated at FITT (IIT Delhi) and ITEL (IIT Madras) for technical and business mentorship.',
        status: 'current',
        // specs: 'Phase 2',
    },
    {
        id: 'industrial_support',
        date: 'Apr 2025',
        title: 'Industrial Partnerships',
        description: 'Awarded industrial support through initiatives including Boeing (BUILD 4.0), HDFC Bank (Parivartan Challenge), and Oil India (Drift Tech).',
        status: 'current',
        // specs: 'Phase 2',
    },
    {
        id: 'government_support',
        date: 'Aug 2025',
        title: 'Government Grants & Support',
        description: 'Received R&D backing from DST (NIDHI PRAYAS) and MeitY (TIDE 2.0) to advance technology development.',
        status: 'current',
        // specs: 'Phase 3',
    },
    {
        id: 'private_funding',
        date: 'Oct 2025',
        title: 'Pre-Seed Funding Secured',
        description: 'Closed an initial Pre-seed round with angel investors to accelerate development and early commercialization efforts.',
        status: 'current',
        // specs: 'Phase 3',
    },
] as const;

// Validate at runtime
export const milestones: Milestones = milestonesSchema.parse(rawMilestones);

// Vision items (future roadmap)
export const visionItemSchema = z.object({
    year: z.string(),
    name: z.string(),
    desc: z.string(),
});

export const visionItems = z.array(visionItemSchema).parse([
  {
    year: 'Vision',
    name: 'Indigenous Propulsion Excellence',
    desc: 'Advancing indigenous liquid rocket propulsion through high-performance engineering to enable global space innovation.',
  },
]);


export type VisionItem = z.infer<typeof visionItemSchema>;
