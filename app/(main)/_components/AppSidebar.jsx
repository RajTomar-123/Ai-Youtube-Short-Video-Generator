"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar"
import { Button } from '../../../components/ui/button'
import { Gem, HomeIcon, LucideFileVideo, Search, WalletCards } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuthContext } from "../../provider";

const MenuItems = [
  {
    title: 'Home',
    url: '/dashboard',
    Icon: HomeIcon
  },
  {
    title: 'Create New Video',
    url: '/create-new-video',
    Icon: LucideFileVideo
  },
  {
    title: 'Billing',
    url: '/billing',
    Icon: WalletCards
  }
]

const AppSidebar = () => {
  const path = usePathname();
  const { user } = useAuthContext();
  console.log(path);
  return (
    <Sidebar>
      <SidebarHeader>
        <div>
          <div className='flex items-center gap-3 w-full justify-center mt-5'>
            <Image src={'/logo.svg'} alt='logo' width={40} height={40} />
            <h2 className='font-bold text-2xl'>Video Gen</h2>
          </div>
          <h2 className='text-lg text-gray-400 text-center mt-3'>AI Short Video Generator</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className='mx-3 mt-10'>
            <Link href={'/create-new-video'}>
              <Button className='w-full'>+ Create New Video</Button>
            </Link>
          </div>
          <SidebarMenu>
            {MenuItems.map((menu, index) => (
              <SidebarMenuItem key={index} className='mt-3 mx-3'>
                <SidebarMenuButton isActive={path == menu.url} className='p-5'>
                  <Link href={menu.url} className='flex items-center gap-4 p-3'>
                    <menu.Icon className="w-5 h-5" />
                    <span>{menu.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className='p-5 border rounded-lg mb-6 bg-gray-800'>
          <div className='flex items-center justify-between'>
            <Gem className='text-gray-400' />
            <h2 className='text-gray-400'>{user?.credits} Credits Left</h2>
          </div>
          <Link href={'/billing'}>
            <Button className='w-full mt-3 hover:cursor-pointer'>Buy More Credits</Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
