import React from 'react'
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const header = async () => {
  await checkUser();
  // This will ensure that the user is checked before rendering the header

  // If the user is not logged in, they will be redirected to the login page
  // If the user is logged in, they will be able to see the dashboard and add transactions
  // The UserButton will show the user's profile picture and name if they are logged in
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="GrowEasy Logo" height={60} width={200} className="h-12 w-auto object-contain" />
        </Link>

        <div className='flex items-center space-x-4'>
          <SignedIn>
            <Link href={"/dashboard"} className="text-gray-600 hover:text-blue-600 flex items-center gap-2">

             {/* Untuk Tombol Dashboard  */}
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
                {/* This will show "Dashboard" text on larger screens */}
              </Button>
            </Link>

            {/* Untuk Tombol Add Transaction */}
            <Link href={"/transaction/create"} className="flex items-center gap-2">
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
                {/* This will show "Dashboard" text on larger screens */}
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{
                elements: {
                    avatarBox: "h-10 w-10",
                }
            }}/>
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}

export default header