'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'



const AuthForm = ({ type }: { type: string }) => {
    const [user, setUser] = useState(null)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const formSchema = authFormSchema(type)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        setIsLoading(true)

        try {
            //Sign Up with appWrite & create Plaid token

            if (type === 'sign-up') {
                const newUser = await signUp(data)

                setUser(newUser)
            }
            if (type === 'sign-in') {

                const reponse = await signIn({
                    email: data.email,
                    password: data.password
                })


                if (response) {

                    router.push('/')
                }
            }



        } catch (error) {

            console.log(error)
        }
        finally {
            setIsLoading(false)

        }

    }

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link href='/' className=' flex cursor-pointer items-center gap-1'>
                    <Image
                        src='/icons/logo.svg'
                        height={34}
                        width={34}
                        alt='Bank logo'
                    />
                    <h1 className='text-26 font-ibm-plex-serif 
                      font-bold text-black-1'>
                        Bankifyy
                    </h1>

                </Link>

                <div className='flex-col flex gap-1 md:gap-3'>
                    <h1 className=' text-24 lg:text-36
         font-semibold text-gray-900'>
                        {user ?
                            'Link account' : type === 'sign-in' ? 'Sign in' : 'Sign up'}
                    </h1>
                    <p className='text-16 font-normal text-gray-600'>
                        {
                            user
                                ? 'Link you account to get started'
                                : 'Please enter your details'
                        }
                    </p>
                </div>
            </header>

            {user ? (
                <div className='flex-col flex gap-4'>
                    {/* Plaid link */}
                </div>

            ) : (
                <div >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {type === 'sign-up' && (
                                <>


                                    <div className='flex  gap-4'>

                                        <CustomInput
                                            control={form.control}
                                            name="firstName"
                                            label='First Name'
                                            placeholder='Enter your first name'
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="lastName"
                                            label='Last Name'
                                            placeholder='Enter your last  name'
                                        />

                                    </div>


                                    <CustomInput
                                        control={form.control}
                                        name="address1"
                                        label='Address'
                                        placeholder='Enter your specific address'
                                    />

                                    <CustomInput
                                        control={form.control}
                                        name="city"
                                        label='City'
                                        placeholder='Enter your city Name'
                                    />
                                    <div className='flex gap-4'>

                                        <CustomInput
                                            control={form.control}
                                            name="state"
                                            label='State'
                                            placeholder='Ex Karnataka'
                                        />

                                        <CustomInput
                                            control={form.control}
                                            name="postalCode"
                                            label='Postal Code'
                                            placeholder='Enter your postal code'
                                        />

                                    </div>

                                    <div className='flex gap-4'>

                                        <CustomInput
                                            control={form.control}
                                            name="dateOfBirth"
                                            label='Date of Birth'
                                            placeholder='dd/mm/yyyy'
                                        />

                                        <CustomInput
                                            control={form.control}
                                            name="adharNumber"
                                            label='Adhar  Number'
                                            placeholder='Enter your Adhar No'
                                        />

                                    </div>
                                </>
                            )}

                            <CustomInput
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="Enter your Email"
                            />
                            <CustomInput
                                control={form.control}
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                            />
                            <div className='flex flex-col gap-4'>
                                <Button type="submit"
                                    disabled={isLoading}
                                    className='form-btn'
                                >
                                    {isLoading ?
                                        <>
                                            <Loader2 size={20}
                                                className='animate-spin' /> &nbsp;Loading...
                                        </>
                                        :
                                        type === 'sign-in' ? 'Sign in' : 'Sign up'
                                    }

                                </Button>
                            </div>
                        </form>
                    </Form>

                    <footer className='flex justify-center gap-1'>
                        <p className='text-14 font-normal text-gray-600'>
                            {type === 'sign-in' ? 'Don’t have an account?' : 'Already have an account?'} </p>
                        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
                            className='form-link'>
                            {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                        </Link>

                    </footer>


                </div>
            )

            }

        </section>
    )
}

export default AuthForm