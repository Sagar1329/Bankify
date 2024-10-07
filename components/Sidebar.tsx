import Link from 'next/link'
import Image from 'next/image'
const Sidebar = ({ user }: SiderbarProps) => {
    return (
        <section className='sidebar'>
            <nav className='flex flex-col gap-4'>
                <Link href='/' className='mb-12 
        cursor-pointer
         items-center
          gap-2'>
                    <Image
                        src='/icons/logo.svg'
                        height={34}
                        width={34}
                        alt='Bank logo'
                        className='size-[24px] max-xl:size-14' />

                    <h1 className='sidebar-logo'>
                        Bankify
                    </h1>

                </Link>

            </nav>
        </section>
    )
}

export default Sidebar