import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createResponse, getAllResponses, getResponsesByLanguage, addManager, getAllManagers, getActiveManagers, deleteManager } from "./db";
import { notifyOwner } from "./_core/notification";
import fetch from 'node-fetch';

const responseSchema = z.object({
  language: z.enum(["ar", "en", "ml", "ne"]),
  name: z.string().min(1),
  company: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  rating1: z.number().min(1).max(5),
  rating2: z.number().min(1).max(5),
  rating3: z.number().min(1).max(5),
  rating4: z.number().min(1).max(5),
  rating5: z.number().min(1).max(5),
  rating6: z.number().min(1).max(5),
  suggestions: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  forms: router({
    submit: publicProcedure
      .input(responseSchema)
      .mutation(async ({ input }) => {
        await createResponse(input);
        
        const languageNames = {
          ar: "العربية",
          en: "English",
          ml: "മലയാളം",
          ne: "नेपाली"
        };
        
        // إرسال البيانات إلى Google Sheets
        try {
          const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbwtff-gl9Z2nmyQKH9T28VKaNWxWd0CwAXC0WGRNQykvD3wRRJ8YCZzL0Xrquao0eef/usercontent';
          await fetch(googleSheetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              language: input.language,
              participantName: input.name,
              participantRole: input.company,
              q1: input.rating1,
              q2: input.rating2,
              q3: input.rating3,
              q4: input.rating4,
              q5: input.rating5,
              q6: input.rating6,
              comments: input.suggestions
            })
          }).catch(err => console.log('Google Sheets sync error (non-blocking):', err));
        } catch (error) {
          console.log('Google Sheets sync error (non-blocking):', error);
        }
        
        await notifyOwner({
          title: `New Workshop Evaluation - ${languageNames[input.language]}`,
          content: `New response received from ${input.name} (${input.company})\n\nRatings: ${input.rating1}, ${input.rating2}, ${input.rating3}, ${input.rating4}, ${input.rating5}, ${input.rating6}\n\nSuggestions: ${input.suggestions || "None"}`
        });
        
        return { success: true };
      }),
    
    getAll: protectedProcedure.query(async () => {
      return await getAllResponses();
    }),
    
    getByLanguage: protectedProcedure
      .input(z.object({ language: z.enum(["ar", "en", "ml", "ne"]) }))
      .query(async ({ input }) => {
        return await getResponsesByLanguage(input.language);
      }),
  }),

  managers: router({
    add: protectedProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await addManager(input);
        return { success: true };
      }),
    
    getAll: protectedProcedure.query(async () => {
      return await getAllManagers();
    }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteManager(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
