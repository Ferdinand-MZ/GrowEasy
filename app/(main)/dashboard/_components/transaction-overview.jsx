"use client"
import React from 'react'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { format} from 'date-fns';
import { ArrowDownRight } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
    '#8884d8', // Purple
    '#82ca9d', // Green
    '#ffc658', // Yellow
    '#ff8042', // Orange
    '#ff6384', // Pink
    '#36a2eb', // Blue
    '#4bc0c0', // Teal
    '#f7464a', // Red
]

const DashboardOverview = ({accounts, transactions}) => {
//     const [selectedAccountId, setSelectedAccountId] = useState(
//     accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
//   )

    const [selectedAccountId, setSelectedAccountId] = useState(() => {
    if (!accounts || accounts.length === 0) return null;
    return accounts.find((a) => a.isDefault)?.id || accounts[0].id;
    });



//   Filter Transaksi untuk akun yang dipilih
    // const accountTransactions = transactions.filter(
    //     (t) => t.accountId === selectedAccountId
    // );

    const accountTransactions = (transactions || []).filter(
    (t) => t.accountId === selectedAccountId
    );

    // Get recent transactions (last 5)
    const recentTransactions = accountTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });
    
    // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

    // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

    return (
    <div className='grid gap-4 md:grid-cols-2'>
        <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
        <CardTitle className="text-base font-normal">
            Recent Transactions
        </CardTitle>

        <Select
        value={selectedAccountId}
        onValueChange={setSelectedAccountId}
        >
        <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Account" />
        </SelectTrigger>
        <SelectContent>
            {accounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                    {account.name}
                </SelectItem>
            ))}
        </SelectContent>
        </Select>

        </CardHeader>
         <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center",
                        transaction.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      ${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        </Card>
        
        {/* Expense Breakdown Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses this month
            </p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardOverview