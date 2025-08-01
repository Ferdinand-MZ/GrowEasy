"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import ReceiptScanner from "./receipt-scanner";

const AddTransactionForm = ({accounts, categories, editMode = false, initialData = null,}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const {register, setValue, handleSubmit, formState: {errors}, watch, getValues, reset } =
    useForm({
        resolver:zodResolver(transactionSchema),
        defaultValues:
         editMode && initialData?{
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description || "",
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && { 
                recurringInterval: initialData.recurringInterval,
            }),
         } :
        {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
        }
    })

    const {
        loading: transactionLoading,
        fn: transactionFn,
        data: transactionResult,
    } = useFetch(editMode ? updateTransaction: createTransaction);

    const type = watch("type");


    const filteredCategories = categories.filter(
        (category) => category.type === type
    )

    const isRecurring = watch("isRecurring");
    const date = watch("date");

    const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

    useEffect(() => {
        if(transactionResult?.success && !transactionLoading) {
            toast.success(
            editMode
            ? "Transaction Updated Successfully"
            : "Transaction Created Successfully");
            reset();
            router.push(`/account/${transactionResult.data.accountId}`);
        }
    }, [transactionResult, transactionLoading, editMode]);

    const handleScanComplete = (scannedData) => {
    console.log("Scanned data:", scannedData); // ⬅️ Debug output

    if(scannedData) {
        setValue("amount", scannedData.amount?.toString());

        setValue("date", new Date(scannedData.date));

        if (scannedData.description) {
            setValue("description", scannedData.description);
        }

        if (scannedData.category) {
            setValue("category", scannedData.category);
        }
    }
}


  return (
    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
        {/* AI Receipt Scanner */}
        {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} /> }

        <div className='space-y-2'>
            <label className='text-sm font-medium'>Type</label>
            <Select 
                onValueChange={(value) => setValue("type", value)}
                defaultValue={type}
            >
            <SelectTrigger>
                <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
            </Select>

            {errors.type && (
                <p className='text-red-500 text-sm'>{errors.type.message}</p>
            )}
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-2'>
            <label className='text-sm font-medium'>Amount</label>
            <Input 
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
            />

            {errors.amount && (
                <p className='text-red-500 text-sm'>{errors.amount.message}</p>
            )}
        </div>

        <div className='space-y-2'>
            <label className='text-sm font-medium'>Account</label>
            <Select 
                onValueChange={(value) => setValue("accountId", value)}
                defaultValue={getValues("accountId")}
            >
            <SelectTrigger>
                <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
                {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                        {account.name} (${parseFloat(account.balance).toFixed(2)})
                    </SelectItem>
                ))}

                <CreateAccountDrawer>
                <Button
                    asChild
                    variant="ghost"
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                    <span>Create Account</span>
                </Button>
                </CreateAccountDrawer>


            </SelectContent>
            </Select>

            {errors.accountId && (
                <p className='text-red-500 text-sm'>{errors.accountId.message}</p>
            )}
        </div>
        </div>

        <div className='space-y-2'>
            <label className='text-sm font-medium'>Category</label>
            <Select 
            value={watch("category")}
            onValueChange={(value) => setValue("category", value)}
            >

            <SelectTrigger>
                <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
                {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
            </Select>

            {errors.category && (
                <p className='text-red-500 text-sm'>{errors.category.message}</p>
            )}
        </div>

        <div className='space-y-2'>
            <label className='text-sm font-medium'>Date</label>
            
            <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full pl-3 text-left font-normal">
                    {date ? format(date, "PPP") : <span>Select Date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                mode = "single"
                selected = {date}
                onSelect={(date) => setValue("date", date)}
                disabled={(date) => date > new Date() || date < new Date("2020-01-01") } initialFocus
                />

            </PopoverContent>
            </Popover>

            {errors.date && (
                <p className='text-red-500 text-sm'>{errors.date.message}</p>
            )}
        </div>

        <div className='space-y-2'>
            <label className='text-sm font-medium'>Description</label>
            <Input placeholder="Enter Description" {...register("description")} />

            {errors.description && (
                <p className='text-red-500 text-sm'>{errors.description.message}</p>
            )}
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">
                  Recurring Transaction
                </label>

                <p className="text-sm text-muted-foreground">Set Up A Recurring Schedule For This Transaction</p>
              </div>
              <Switch 
                checked={isRecurring}
                onCheckedChange={(checked) => setValue("isRecurring", checked)} 
              />
        </div>

        {isRecurring && (<div className='space-y-2'>
            <label className='text-sm font-medium'>Recurring Interval</label>
            <Select 
                onValueChange={(value) => setValue("recurringInterval", value)}
                defaultValue={getValues("recurringInterval")}
            >
            <SelectTrigger>
                <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
            </Select>

            {errors.recurringInterval && (
                <p className='text-red-500 text-sm'>{errors.recurringInterval.message}</p>
            )}
        </div>
    )}


    <div className='flex gap-4'>
        <Button
            variant="outline"
            type="button"
            onClick={() => router.back()}
            disabled={transactionLoading}
        >Cancel</Button>
        <Button
            type="submit" className='w-full' disabled={transactionLoading}
        >
        {transactionLoading?(
            <>
            {" "}
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            {editMode ? "Updating..." : "Creating..."}
            </>
        ) : editMode ? (
            "Update Transaction"
        ) : (
            "Create Transaction"
        )}    
        </Button>
    </div>
    </form>
  )
}

export default AddTransactionForm