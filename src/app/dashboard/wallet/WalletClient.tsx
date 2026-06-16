'use client';

import { useState } from 'react';
import { Transaction } from '@prisma/client';

export default function WalletClient({ 
  walletBalance, 
  transactions 
}: { 
  walletBalance: number, 
  transactions: any[] 
}) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('5000');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'deposits') return tx.type === 'DEPOSIT';
    if (activeTab === 'withdrawals') return tx.type === 'WITHDRAWAL';
    if (activeTab === 'payouts') return tx.type === 'PAYOUT';
    return true;
  });

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full flex flex-col gap-gutter">
      {/* Hero Balance Card */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-unit-lg md:p-unit-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-unit-lg relative overflow-hidden shadow-[0px_4px_12px_rgba(10,22,40,0.04)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary-container"></div>
        <div className="flex flex-col gap-2">
          <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Total Available Balance</span>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-xl font-headline-xl text-primary">{formatCurrency(walletBalance)}</span>
            {/* Optional percent change if tracked, currently static */}
            <span className="text-body-sm font-body-sm text-tertiary-fixed-dim bg-tertiary-container/10 px-2 py-0.5 rounded flex items-center gap-1 hidden">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 2.4%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-unit-md w-full md:w-auto mt-4 md:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 md:flex-none h-14 px-8 bg-secondary-container text-on-secondary-container font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-bold"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            Add Money
          </button>
          <button className="flex-1 md:flex-none h-14 px-8 bg-surface-container-lowest text-primary border border-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors font-bold">
            <span className="material-symbols-outlined">arrow_downward</span>
            Withdraw
          </button>
        </div>
      </section>

      {/* Transactions Section */}
      <section className="flex flex-col gap-unit-md mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-headline-md font-headline-md text-primary">Recent Transactions</h3>
          <button className="text-label-md font-label-md text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors">
            View Statements <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-outline-variant overflow-x-auto">
            {['all', 'deposits', 'withdrawals', 'payouts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-label-md font-label-md whitespace-nowrap transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
              >
                {tab === 'all' ? 'All Activity' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low/50">
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase">Date &amp; Time</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase">Type</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase">Description</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase text-right">Amount</th>
                  <th className="py-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-body-sm font-body-sm text-on-surface">
                {filteredTransactions.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-on-surface-variant">No transactions found</td>
                   </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isPositive = tx.type === 'DEPOSIT' || tx.type === 'PAYOUT';
                    let iconName = 'south_west'; // default deposit
                    let iconColorClass = 'bg-tertiary-container/10 text-on-tertiary-container';
                    let amountColorClass = 'text-on-tertiary-container';
                    
                    if (tx.type === 'WITHDRAWAL' || tx.type === 'INVESTMENT') {
                      iconName = 'north_east';
                      iconColorClass = 'bg-error/10 text-error';
                      amountColorClass = 'text-error';
                    } else if (tx.type === 'PAYOUT') {
                      iconName = 'auto_awesome';
                      iconColorClass = 'bg-secondary-container/20 text-on-secondary-container';
                    }

                    // For meta description
                    const desc = tx.meta && typeof tx.meta === 'object' && (tx.meta as any).description 
                      ? (tx.meta as any).description 
                      : (tx.type === 'DEPOSIT' ? 'Wallet Deposit' : tx.type === 'WITHDRAWAL' ? 'Wallet Withdrawal' : tx.type === 'PAYOUT' ? 'FD Interest Payout' : 'Investment Creation');

                    return (
                      <tr key={tx.id} className="border-b border-outline-variant hover:bg-surface-container-low/30 transition-colors h-14">
                        <td className="py-3 px-6 whitespace-nowrap text-on-surface-variant">
                          {new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(tx.createdAt))}
                        </td>
                        <td className="py-3 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded flex items-center justify-center ${iconColorClass}`}>
                              <span className="material-symbols-outlined text-[18px]">{iconName}</span>
                            </div>
                            <span className="capitalize">{tx.type.toLowerCase()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-primary font-medium">{desc}</td>
                        <td className={`py-3 px-6 text-right whitespace-nowrap font-data-mono font-medium ${amountColorClass}`}>
                          {isPositive ? '+' : '-'} {formatCurrency(Number(tx.amount))}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-label-sm font-label-sm ${
                            tx.status === 'SUCCESS' ? 'bg-tertiary-container/20 text-on-tertiary-container' : 
                            tx.status === 'PENDING' ? 'bg-surface-container-high text-on-surface-variant' : 
                            'bg-error/10 text-error'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add Money Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-[0px_12px_32px_rgba(10,22,40,0.08)] border border-outline-variant overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant">
              <h2 className="text-headline-md font-headline-md text-primary">Add Money to Wallet</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-label-md text-primary">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-data-mono">₹</span>
                  <input
                    className="w-full h-14 pl-10 pr-4 rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-data-mono text-body-lg text-primary"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[1000, 5000, 10000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(String(val))}
                      className="px-3 py-1.5 rounded border border-outline-variant text-label-sm font-label-sm text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                    >
                      + ₹{val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-full h-14 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
