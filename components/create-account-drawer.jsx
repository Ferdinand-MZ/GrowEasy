"use client";
import React from "react";
import { toast } from "sonner";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);

  const { 
    register,
    handleSubmit,
    formState:{errors},
    setValue,
    watch,
    reset,
 } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    data: newAccount, 
    error, 
    fn: createAccountFn, 
    loading: createAccountLoading, } = useFetch(createAccount);

  const onSubmit=async(data)=>{
    await createAccountFn(data);
  }

  useEffect(() => {
    if(newAccount && !createAccountLoading) {
      toast.success("Account Created Successfully !!!");
      reset();
      setOpen(false);
    }
  }, [createAccountLoading, newAccount]);

  useEffect(() => {
    if(error) {
      toast.error(error.message || "Failed To Create Account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>

        {/* Form Section */}
        <div className="px-4 pb-4">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Nama Akun */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Account Name
              </label>
              <Input id="name" placeholder="e.g., Main Checking" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Tipe Akun */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>

            {/* balance akun */}
            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-medium">
                Initial Balance
              </label>
              <Input id="balance" type="number" step="0.01" placeholder="0.00" {...register("balance")} />
              {errors.balance && <p className="text-sm text-red-500">{errors.balance.message}</p>}
            </div>

            {/* Pilihan Default akun atau tidak */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">
                  Set As Default Account
                </label>

                <p className="text-sm text-muted-foreground">This account will be selected as default Account</p>
              </div>
              <Switch id="isDefault" onCheckedChange={(checked) => setValue("isDefault", checked)} checked={watch("isDefault")} />
            </div>

            <div>
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1" disabled={createAccountLoading}>
                  {createAccountLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                      Creating...
                    </>
                    ) : ("Create Account")}
                </Button>
              </DrawerClose>

              <Button type="submit" className="flex-1">
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
