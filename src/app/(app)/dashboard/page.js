"use client"

import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/navigation'
import React from 'react'

const Dashboard = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const router = useRouter()

    React.useEffect(() => {
        if (window.location.pathname === '/dashboard') {
            if (user.role_id == 1) {
                router.push('/admin/dashboard')
            } else if (user.role_id == 2) {
                router.push('/doctor/dashboard')
            } else if (user.role_id == 3) {
                router.push('/staff/dashboard')
            } else {
                router.push('/patient/dashboard')
            }
        }
    }, [router])


    return (
        <>
            Redirecting...
        </>
    )
}

export default Dashboard