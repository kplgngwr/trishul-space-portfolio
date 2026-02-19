import { z } from 'zod';

/**
 * Team Member Entity Schema
 * @description Zod schema with discriminated union for member type
 */

export const teamMemberTypeSchema = z.enum(['founder', 'advisor', 'mentor']);

export const teamMemberSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.string().min(1, 'Role is required'),
    // Description is optional for some members; keep type as string when present
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    type: teamMemberTypeSchema,
});

export const teamMembersSchema = z.array(teamMemberSchema);

// Inferred types
export type TeamMemberType = z.infer<typeof teamMemberTypeSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMembers = z.infer<typeof teamMembersSchema>;
