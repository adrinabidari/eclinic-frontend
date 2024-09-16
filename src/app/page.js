import LoginLinks from '@/app/LoginLinks'
import Features from '@/components/HomePage/Features'
import Footer from '@/components/HomePage/Footer'
import Hero from '@/components/HomePage/Hero'
import Navbar from '@/components/HomePage/Navbar'

export const metadata = {
    title: 'eClinic Nexus',
}

const Home = () => {
    return (
        <>
            <div className=''>
                <Navbar />
                <Hero />
                <Features />
                <Footer />
            </div>
        </>
    )
}

export default Home
