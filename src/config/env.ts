import { z } from "zod";


export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
    const result = envSchema.safeParse(raw);

    if (!result.success) {
        throw new Error(`Invalid environment: \n${z.prettifyError(result.error)}`)
    }
    
    return result.data;
}