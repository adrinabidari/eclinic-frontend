
import { Nunito, Poppins } from 'next/font/google'
import '@/app/global.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ConfigProvider } from 'antd';


const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: '400',
})


const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={poppins.className}>
            <head>
                <title>eClinic Nexus</title>
            </head>
            <body className="antialiased">
                <AppRouterCacheProvider>
                    <ConfigProvider
                        theme={{
                            token: {
                                fontFamily: poppins
                            }
                        }}
                    >
                        {children}

                    </ConfigProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    )
}

export default RootLayout
