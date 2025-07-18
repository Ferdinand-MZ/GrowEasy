"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCurrentBudget(accountId) {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        });
        
        if (!user) {
            throw new Error("User Not Found")
        }

        const budget = await db.budget.findFirst({
            where: {
                userId: user.id,
            }
        });

        const currentDate = new Date();
        const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

        const expenses = await db.transaction.aggregate({
            where: {
                userId: user.id,
                type: "EXPENSE",
                date: {
                    gte: startOfMonth, //gte itu greater than the start of month
                    lte: endOfMonth //lte itu less than end of the month
                },
                accountId
            },
            _sum:{
                amount: true,
            },
        });

        // kalkulasi budget dan nilainya
        return {
            budget: budget ? {...budget, amount: budget.amount.toNumber() } : null,
            currentExpenses: expenses._sum.amount
            ? expenses._sum.amount.toNumber()
            : 0,
        }
    } catch (error) {
        console.error
    }
}

export async function updateBudget(amount) {
    try {
         const {userId} = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        });
        
        if (!user) {
            throw new Error("User Not Found")
        }

         // upsert kalo budget ga exist bakal di create, kalo exist bakal di update
        const budget = await db.budget.upsert({
            where: {
                userId: user.id,
            },
            update: {
                amount,
            },
            create: {
                userId: user.id,
                amount
            }
        });

        revalidatePath("/dashboard");
        return {
            success: true,
            data: {...budget, amount: budget.amount.toNumber()},
        };
   } catch (error) {
    console.error("Error Updating Budget :", error)
    return {success: false, error:error.message}
   }
}