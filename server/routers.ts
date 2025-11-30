import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createResponse, getAllResponses, getResponsesByLanguage, addManager, getAllManagers, getActiveManagers, deleteManager } from "./db";
import { notifyOwner } from "./_core/notification";
import axios from "axios";

// Google Apps Script Web App URL
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/1NP2CyUvv2DzirNka7m_8z2dKpJjpk9F7Y6dIOV4Yr3Otax2JpB_pek8J/usercontent";

// Function to send data to Google Sheets
async function sendToGoogleSheet(data: any) {
  try {
    await axios.post(GOOGLE_SHEET_API_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.warn("[Google Sheets] Failed to send data:", error);
    // Don't throw error - continue even if Google Sheets fails
  }
}

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
        
        // Send data to Google Sheets
        await sendToGoogleSheet({
          language: input.language,
          participantName: input.name,
          participantRole: input.company,
          q1: input.rating1,
          q2: input.rating2,
          q3: input.rating3,
          q4: input.rating4,
          q5: input.rating5,
          comments: input.suggestions || ""
        });
        
        const languageNames = {
          ar: "العربية",
          en: "English",
          ml: "മലയാളം",
          ne: "नेपाली"
        };
        
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
