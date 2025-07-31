import { DollarSign, CoinsIcon, WalletIcon, ReceiptTextIcon } from 'lucide-react';
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'


function CardInfo({ budgetList }) {

    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [budgetCount, setBudgetCount] = useState(0);

    useEffect(() => {
        if (budgetList && budgetList.length > 0) {
            CalculateCardInfo();
        }
    }, [budgetList])

    const CalculateCardInfo = () => {
        console.log('Budget List:', budgetList);
        let totalBudgetAmount = 0;
        let totalSpentAmount = 0;

        budgetList.forEach(element => {
            totalBudgetAmount += Number(element.amount) || 0;
            totalSpentAmount += Number(element.totalSpend) || 0;
        });

        setTotalBudget(totalBudgetAmount);
        setTotalSpent(totalSpentAmount);
        setBudgetCount(budgetList.length);

        console.log('Calculated values:', {
            totalBudget: totalBudgetAmount,
            totalSpent: totalSpentAmount,
            budgetCount: budgetList.length
        });
    }

    return (
       <div>
        {budgetList?.length > 0 ? (
            <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                <div className='p-7 border rounded-lg flex items-center justify-between'>
                    <div>
                    <h2 className='text-sm'>Total Budget</h2>
                    <h2 className='text-2xl font-bold'>${totalBudget.toFixed(0)}</h2>
                </div>
                <DollarSign className='bg-primary rounded-full p-3 h-12 w-12 text-white'/>
                </div>
                <div className='p-7 border rounded-lg flex items-center justify-between'>
                    <div>
                    <h2 className='text-sm'>Total Spent</h2>
                    <h2 className='text-2xl font-bold'>${totalSpent.toFixed(0)}</h2>
                </div>
                <ReceiptTextIcon className='bg-primary rounded-full p-3 h-12 w-12 text-white'/>
                </div>
                <div className='p-7 border rounded-lg flex items-center justify-between'>
                    <div>
                    <h2 className='text-sm'>No. of Budgets</h2>
                    <h2 className='text-2xl font-bold'>{budgetCount}</h2>
                </div>
                <WalletIcon className='bg-primary rounded-full p-3 h-12 w-12 text-white'/>
                </div>
            </div>
        ) : (
            <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
               {[1,2,3].map((item, index) => (
                    <div key={index} className='h-[110px] w-full bg-gray-200 animate-pulse rounded-lg'>
                    </div>
                ))}
            </div>
        )}
        
        </div>
    )
}
export default CardInfo
