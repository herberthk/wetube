/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useCallback, useState } from 'react';
import { AppBar, AppBarSection, Avatar } from '@progress/kendo-react-layout';
import { Badge, BadgeContainer } from '@progress/kendo-react-indicators';
import { bellIcon, searchIcon } from '@progress/kendo-svg-icons';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const kendokaAvatar = 'https://demos.telerik.com/kendo-react-ui/assets/suite/kendoka-react.png';

export const Header = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearch = useCallback(async (term: string) => {
        if (!term.trim()) return;
            router.push(`/search/${encodeURIComponent(term)}`);
    }, [router]);

    return (
        <div className='w-full' role='banner'>
            <AppBar 
                themeColor="primary" 
                className='justify-between w-full !flex !px-4 !flex-row !flex-nowrap'
                // role=""
            >
                <Link 
                    href="/" 
                    className="text-lg md:text-3xl m-0 lobster text-white font-bold"
                    aria-label="WeTube Home"
                    role="link"
                >
                    WeTube
                </Link>
                <AppBarSection className='md:!w-2xl w-[80%] flex flex-row !rounded-full bg-white !pl-5 !pr-3'>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch(searchTerm);
                        }}
                        className="w-full flex"
                    >
                        <Input
                            className='!px-5 !py-2 !w-full !border-0 !bg-white !border-transparent'
                            type='search'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value as string)}
                            placeholder='Search for videos'
                            aria-label="Search for videos"
                            id="search-input"
                            autoComplete='on'
                            tabIndex={0}
                            role='searchbox'
                        />
                        <Button 
                            type="submit" 
                            fillMode="solid" 
                            className='!text-black' 
                            svgIcon={searchIcon} 
                            aria-label="Submit search"
                        />
                    </form>
                </AppBarSection>
                <div className='flex-row gap-2 hidden md:flex'>
                <AppBarSection className="actions">
                    <Button type="button" fillMode="flat" svgIcon={bellIcon} aria-label="Notifications">
                        <BadgeContainer>
                            <Badge rounded="full" themeColor="primary" size="small" position="inside" aria-label="Notification count" />
                        </BadgeContainer>
                    </Button>
                </AppBarSection>
                <AppBarSection>
                    <Avatar type="image">
                        <img src={kendokaAvatar} alt="KendoReact Layout Kendoka Avatar" />
                    </Avatar>
                </AppBarSection>
                </div>
               
            </AppBar>  
            </div>        
    );
};
