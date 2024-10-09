import HeaderBox from '@/components/HeaderBox'
import RightSidebar from '@/components/RightSidebar'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'

const Home = () => {

    const loggedIn = { firstName: "Sagar",lastName:"gowda",email:"sagar@gmail.com" }
    return (
        <section className='home'>
            <div className='home-content'>
                <header className='home-header'>
                    <HeaderBox
                        type="greeting"
                        title="Hello, "
                        user={loggedIn?.firstName || 'Guest'}
                        subtext="Access and manage your money with your account and transactions"
                    />

                    <TotalBalanceBox

                        accounts={[]}
                        totalBanks={1}
                        totalCurrentBalance={9876.00}
                    />
                </header>

                RECENT TRANSACTIONS 
            </div>
<RightSidebar
user={loggedIn}
transactions={[]}
                banks={[{ currentBalance: 34567.67 }, { currentBalance :29999.99}]}
/>

        </section>
    )
}

export default Home