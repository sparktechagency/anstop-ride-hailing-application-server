import { z } from "zod";

const earningsChartSchema = z.object({
    query: z.object({
        year: z.string().optional()
    }).strict()
});

export const AdminValidation = {
    earningsChartSchema
}