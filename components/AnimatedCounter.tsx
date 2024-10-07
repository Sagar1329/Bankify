'use client'

import React from 'react'
import CountUp from 'react-countup'

const AnimatedCounter = ({ amount }: { amount: number }) => {
    return (
        <div className='w-full'>
            <CountUp
                decimal=','
                duration={1}
                prefix='$'
                end={amount} />
        </div>
    )
}

export default AnimatedCounter