"use client"

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { navLinks } from "@/constants"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"
import { Menu } from "lucide-react"

const MobileNav = () => {
    const pathname = usePathname();

    return (
        <header className="header">
            <div className='flex items-center'>
                <Link href="/" className="sidebar-logo">
                    <Image src="/assets/images/logo-icon.svg" alt="logo" width={32} height={32} />
                    <span className='bg-purple-gradient text-white rounded-full text-xl px-3 py-2 font-bold'>Image_AI</span>
                </Link>
            </div>
            
            <nav className="flex gap-2">
                <SignedIn>
                    <UserButton />

                    <Sheet>
                        <SheetTrigger>
                           <Menu size={24} />
                        </SheetTrigger>
                        <SheetContent className="sheet-content sm:w-64">
                            <SheetTitle></SheetTitle>
                            <>                              
                                <ul className="header-nav_elements">
                                    {navLinks.map((link) => {
                                        const isActive = link.route === pathname

                                        return (
                                            <li
                                                className={`${isActive && 'gradient-text'} p-18 flex whitespace-nowrap text-dark-700`}
                                                key={link.route}
                                            >
                                                <Link className="sidebar-link cursor-pointer" href={link.route}>
                                                    <Image
                                                        src={link.icon}
                                                        alt="logo"
                                                        width={24}
                                                        height={24}
                                                    />
                                                    {link.label}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </>
                        </SheetContent>
                    </Sheet>
                </SignedIn>

                <SignedOut>
                    <Button asChild className="button bg-purple-gradient bg-cover">
                        <Link href="/sign-in">Login</Link>
                    </Button>
                </SignedOut>
            </nav>
        </header>
    )
}

export default MobileNav