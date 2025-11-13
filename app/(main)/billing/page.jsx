"use client"

import React from 'react'
import { Button } from '../../../components/ui/button';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useAuthContext } from '../../provider';
import { CircleDollarSign } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
const creditsPlans = [
  {
    credits: 10,
    cost: 1
  },
  {
    credits: 50,
    cost: 5
  },
  {
    credits: 100,
    cost: 9
  },
  {
    credits: 200,
    cost: 15
  },
  {
    credits: 500,
    cost: 30
  },
]

const Billing = () => {
  const { user, setUser } = useAuthContext();
  const updateUserCredits = useMutation(api.users.updateUserCredits);

  const onPaymentSuccess = async (cost, credits) => {
    const result = await updateUserCredits({
      uid: user?._id,
      credits: Number(user?.credits) + Number(credits)
    });
    console.log(result);
    setUser(prev => ({
      ...prev,
      credits: Number(user?.credits) + Number(credits)
    }))
    toast('Credits Added!')
  }

  return (
    <div>
      <h2 className='font-bold text-3xl'>Credits</h2>

      <div className='p-4 border rounded-xl flex justify-between mt-7 max-w-2xl'>
        <div>
          <h2 className='font-bold text-xl'>Total Credits</h2>
          <h2 className='text-sm'>1 Credits = 1 Video</h2>
        </div>
        <h2 className='font-bold text-3xl'>{user?.credits} Credits</h2>
      </div>
      <p className='text-sm p-5 text-gray-500 max-w-2xl'>when your credit balance reaches $0, your Video generation will stop working. Add Credits balance topped up. </p>
      <div className='mt-5'>
        <h2 className='font-bold text-2xl'>Buy More Credits</h2>

        <div className=''>
          {creditsPlans.map((plan, index) => (
            <div key={index} className='p-5 mt-3 flex justify-between border rounded-xl max-w-2xl'>
              <h2 className='text-xl flex gap-2 items-center'><CircleDollarSign /><strong>{plan?.credits} Creadits</strong></h2>
              <div className='flex gap-2 items-center'>
                <h2 className='font-medium text-xl'>{plan.cost} $</h2>
                <PayPalButtons style={{ layout: "horizontal" }}
                  onApprove={() => onPaymentSuccess(plan?.cost, plan?.credits)}
                  onCancel={() => console.log("Cancel")}
                  createOrder={(data, actions) => {
                    return actions?.order?.create({
                      purchase_units: [
                        {
                          amount: {
                            value: plan.cost,
                            currency_code: 'USD'
                          }
                        }
                      ]
                    })
                  }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Billing
