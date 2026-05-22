import { z } from "zod";

export const WebsiteConfigSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  description: z.string().max(300).optional(),
  theme: z.string().max(100).optional(),
  pages: z.array(
    z.object({
      id: z.string().min(1),
      slug: z.string().min(1),
      title: z.string().optional(),
      sections: z.array(
        z.object({
          id: z.string().min(1),
          type: z.string().min(1),
          content: z.any().optional()
        })
      ).optional()
    })
  ).optional(),
  metadata: z.record(z.any()).optional()
}).passthrough();
