import HeaderBox from '@/components/HeaderBox'
import React from 'react'

const Home = () => {

    const loggedIn = { firstName: "Sagar" }
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
                </header>
            </div>
        </section>
    )
}

export default Home