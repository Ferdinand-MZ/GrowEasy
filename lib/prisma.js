import prisma from "@/lib/prisma"; // Not @prisma/client
import { PrismaClient } from "./generated/prisma";

export const db = globalThis.prisma || new PrismaClient();

// we gonna make this feature because nextjs hot reloads the server
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

// so the function of this was to prevent the prisma client from being re-initialized
// on every request in development mode, which can lead to issues with hot reloading
