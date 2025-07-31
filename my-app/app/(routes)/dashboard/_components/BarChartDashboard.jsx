import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts'

function BarChartDashboard({ budgetList }) {
  return (
    <div className='border rounded-lg p-5'>
      <h2 className='font-bold text-lg'>Activity</h2>
      <ResponsiveContainer width={'80%'} height={300}>
        <BarChart data={budgetList}
          margin={{ top: 7, right: 5, left: 5, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />

          <Legend />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#0a5c41" />
          <Bar dataKey="amount" stackId="a" fill="#b4e4b8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartDashboard
