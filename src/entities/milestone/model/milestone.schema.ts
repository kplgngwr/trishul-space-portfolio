import { z } from 'zod';

/**
 * Milestone Entity Schema
 * @description Zod schema with discriminated union for status
 */

export const milestoneStatusSchema = z.enum(['completed', 'current', 'upcoming']);

export const milestoneSchema = z.object({
    id: z.string().min(1, 'Milestone ID is required'),
    date: z.string().min(1, 'Date is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    status: milestoneStatusSchema,
    specs: z.string().optional(),
});

export const milestonesSchema = z.array(milestoneSchema);

// Inferred types
export type MilestoneStatus = z.infer<typeof milestoneStatusSchema>;
export type Milestone = z.infer<typeof milestoneSchema>;
export type Milestones = z.infer<typeof milestonesSchema>;
