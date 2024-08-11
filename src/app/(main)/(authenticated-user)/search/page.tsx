'use client'

import { Input } from '@/components/ui'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const router = useRouter()
    const [searchText, setSearchText] = useState("")
    const [hasErrors, setHasErrors] = useState(false)
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    useEffect(() => {
        if (inputRef?.current) {
            inputRef.current.focus()
        }
    }, [])

    const handleInputChange = (newValue: string) => {
        setSearchText(newValue)
        if (newValue.length > 0) {
            setHasErrors(false)
        }
    }

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (searchText.length < 3) {
            setHasErrors(true)
            return
        }
        router.push(`/search/posts?q=${searchText}`)
    }



    return (
        <main className="relative grow flex items-center justify-center w-full px-4 lg:px-[7.5vw] lg:gap-[5vw] max-h-[calc(100vh_-_4.5rem)] overflow-y-scroll">
            <form className='w-full min-w-[300px] max-w-lg' onSubmit={(e) => handleSearch(e)}>

                <h1 className='font-display text-6xl font-medium'>
                    Search
                </h1>
                <Input
                    ref={inputRef}
                    className='w-full mt-4'
                    placeholder='Search for posts, users, tags, etc...'
                    value={searchText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    type='search'
                    hasError={hasErrors}
                    errorMessage={searchText.length == 0  ? 'Please enter a search term' : 'Please enter at least 3 characters'}
                />
            </form>
        </main>
    )
}

export default page