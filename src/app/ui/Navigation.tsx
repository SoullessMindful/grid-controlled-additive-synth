import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className='flex flex-row justify-around items-center h-5 mx-1 border-gray-800 dark:border-gray-200 border-t'>
      <Link href='/' className='text-4xl'>
        Grid
      </Link>
      <Link href='/synth' className='text-4xl'>
        Synth
      </Link>
    </nav>
  )
}