"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { Progress } from "@/components/ui/progress";
<<<<<<< HEAD

const BudgetProgress = () => {
=======
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { updateBudget } from '@/actions/budget';

const BudgetProgress =({ initialBudget, currentExpenses }) => {
>>>>>>> c408a44 (First Commit)
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(
        initialBudget?.amount?.toString() || ""
    );

    const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

    const {
        loading: isLoading,
        fn: updateBudgetFn,
        data, updatedBudget,
        error,
<<<<<<< HEAD
    } = useFetch(updatedBudget)
=======
    } = useFetch(updateBudget)
>>>>>>> c408a44 (First Commit)

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);

        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        await updateBudgetFn(amount);
    };

    useEffect(() => {
        if(updatedBudget?.success) {
            setIsEditing(false);
            toast.success("Budget Updated Successfully")
        }
    }, [updatedBudget]);

    useEffect(() => {
      if (error) {
        toast.error(error.message || "Failed to update budget");
      }
    }, [error]);

    const handleCancel = () => {
        setNewBudget(initialBudget?.amount?.toString() || "");
        setIsEditing(false);
    };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle>Monthly Budget (Default Account)</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
<<<<<<< HEAD
                <Input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className="w-32" placeholder="Enter Amount" autofocus disabled={isLoading} />
=======
                <Input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className="w-32" placeholder="Enter Amount" autoFocus disabled={isLoading} />
>>>>>>> c408a44 (First Commit)
                <Button variant="ghost" size="icon" onClick={handleUpdateBudget} disabled={isLoading}>
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancel} disabled={isLoading}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>Card Description</CardDescription>
                {initialBudget ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(2)} spent` : "No Budget Set"}
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-6 w-6">
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>

<<<<<<< HEAD
        <CardAction>Card Action</CardAction>
=======
>>>>>>> c408a44 (First Commit)
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div className='space-y-2'>
            <Progress value={percentUsed}
            extraStyles={`${
                percentUsed >= 90
                ? "bg-red-500"
                : percent-used > 75
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            />
            <p className='text-xs text-muted-foreground text-right'>
                {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BudgetProgress