import { z } from 'zod';

/**
 * Partner Entity Schema
 */

const partnerCategoryEnum = z.enum(['investor', 'industry', 'incubator']);

export type PartnerCategory = z.infer<typeof partnerCategoryEnum>;

export const partnerSchema = z.object({
    name: z.string().min(1),
    logo: z.string(),
    role: z.string(),
    url: z.string().url().optional(),
    isDark: z.boolean().optional(),
    categories: z.array(partnerCategoryEnum).min(1),
});

export const partnersSchema = z.array(partnerSchema);

export type Partner = z.infer<typeof partnerSchema>;
export type Partners = z.infer<typeof partnersSchema>;
