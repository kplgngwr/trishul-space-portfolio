import { teamMembersSchema, type TeamMembers } from './team-member.schema';

/**
 * Team Member Data
 * @description Statically validated team member data
 */

const rawTeamMembers = [
    {
        name: 'Aditya Singh',
        role: 'Co-Founder & CEO',
        description:
            'Business strategy lead with experience at Abyom Spacetech & Defence and CIE IIIT Hyderabad.',
        type: 'founder',
    },
    {
        name: 'Divyam',
        role: 'Co-Founder & COO',
        description:
            'Propulsion design lead, former Skyroot Aerospace engineer with cryogenic engine expertise.',
        type: 'founder',
    },
    {
        name: 'Rajat Choudhary',
        role: 'Co-Founder & VP',
        description:
            'Aerospace Engineer from Chandigarh University, leads fabrication and hot-fire testing.',
        type: 'founder',
    },
    {
        name: 'Prof. Ashok Jhunjhunwala',
        role: 'Strategic Business Mentor',
        type: 'mentor',
    },
    {
        name: 'Dr. Hardip Rai',
        role: 'Financial Mentor',
        type: 'mentor',
    },
    {
        name: 'Dr. Rajesh Sanghi',
        role: 'Operational Mentor',
        type: 'mentor',
    },
    
] as const;

// Validate at runtime
export const teamMembers: TeamMembers = teamMembersSchema.parse(rawTeamMembers);

// Derived collections
export const founders = teamMembers.filter((m) => m.type === 'founder');
export const mentors = teamMembers.filter((m) => m.type === 'mentor');
