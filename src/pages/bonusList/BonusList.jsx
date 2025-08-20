import React, { useEffect, useState } from 'react';
import { domainName } from '../../config/Auth';


const BonusList = () => {

    const [activeTab, setActiveTab] = useState('in-progress');

    // Sample data for each tab
    const tabData = {
        'in-progress': [
            { id: 1, title: 'Weekend Bonus', description: 'Complete 5 tasks by Sunday', progress: 65 },
            { id: 2, title: 'Daily Login', description: 'Login for 7 consecutive days', progress: 42 },
            { id: 3, title: 'Referral Program', description: 'Refer 3 friends this month', progress: 33 },
        ],
        'redeemed': [
            { id: 1, title: 'Welcome Bonus', description: '$10 free credit', date: '2023-05-15' },
            { id: 2, title: 'Loyalty Reward', description: '500 loyalty points', date: '2023-05-10' },
            { id: 3, title: 'Birthday Gift', description: 'Free spins package', date: '2023-04-28' },
        ],
        'expired-void': [
            { id: 1, title: 'Weekly Challenge', description: 'Expired on 2023-05-01', status: 'Expired' },
            { id: 2, title: 'Deposit Bonus', description: 'Voided due to terms violation', status: 'Void' },
            { id: 3, title: 'Tournament Prize', description: 'Expired on 2023-04-15', status: 'Expired' },
        ],
    };

    return (
        <>

            <div className='w-full'>
                <div className='bg-[#e9eff8]'>
                    <div className="relative uppercase tracking-wider text-sm bg-[var(--primary)] w-[200px] font-bold text-white py-1.5 px-3">
                        Bonus List
                        <span className="absolute top-0 right-[-15px] w-0 h-0 border-t-[32px] border-t-[var(--primary)] border-r-[15px] border-r-transparent"></span>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen text-white mt-3">

                    <div className="flex border-b border-gray-700 mb-6">
                        <button
                            className={`py-3 px-6 font-medium text-sm transition-all duration-300 ${activeTab === 'in-progress'
                                ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            onClick={() => setActiveTab('in-progress')}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                In-progress
                            </div>
                        </button>
                        <button
                            className={`py-3 px-6 font-medium text-sm transition-all duration-300 ${activeTab === 'redeemed'
                                ? 'bg-green-600 text-white border-b-2 border-green-400'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            onClick={() => setActiveTab('redeemed')}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Redeemed
                            </div>
                        </button>
                        <button
                            className={`py-3 px-6 font-medium text-sm transition-all duration-300 ${activeTab === 'expired-void'
                                ? 'bg-red-600 text-white border-b-2 border-red-400'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            onClick={() => setActiveTab('expired-void')}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Expired & Void
                            </div>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                        {activeTab === 'in-progress' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4 text-blue-300">Your Active Bonuses</h2>
                                {tabData['in-progress'].map((item) => (
                                    <div key={item.id} className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                                        <h3 className="font-medium text-lg">{item.title}</h3>
                                        <p className="text-gray-300 mb-2">{item.description}</p>
                                        <div className="w-full bg-gray-600 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${item.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Progress</span>
                                            <span>{item.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'redeemed' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4 text-green-300">Redeemed Rewards</h2>
                                {tabData['redeemed'].map((item) => (
                                    <div key={item.id} className="bg-gray-700 p-4 rounded-lg border-l-4 border-green-500">
                                        <h3 className="font-medium text-lg">{item.title}</h3>
                                        <p className="text-gray-300 mb-1">{item.description}</p>
                                        <div className="flex items-center text-sm text-green-400">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Redeemed on: {item.date}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'expired-void' && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4 text-red-300">Expired & Voided Offers</h2>
                                {tabData['expired-void'].map((item) => (
                                    <div key={item.id} className="bg-gray-700 p-4 rounded-lg border-l-4 border-red-500">
                                        <h3 className="font-medium text-lg">{item.title}</h3>
                                        <p className="text-gray-300 mb-1">{item.description}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Expired' ? 'bg-yellow-800 text-yellow-200' : 'bg-red-800 text-red-200'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="mt-8 bg-blue-900 bg-opacity-30 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-300 mb-2">About Rewards</h3>
                        <p className="text-sm text-gray-300">
                            Track all your bonuses and rewards in one place. Active bonuses show your progress toward completion,
                            redeemed rewards show what you've claimed, and expired/voided section shows offers that are no longer available.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};


export default BonusList;