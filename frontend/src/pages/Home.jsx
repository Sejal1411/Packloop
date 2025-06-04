import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiMail, FiUser, FiTruck, FiPackage, FiCreditCard } from 'react-icons/fi';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className='w-full'>
            <div className='relative isolate overflow-hidden bg-gradient-to-b from-green-100 to-white py-16 sm:py-24 lg:py-32 rounded-lg'>
                <div className='mx-auto max-w-7xl px-6 lg:px-8 text-center'>
                    <h1 className='text-4xl font-bold tracking-tight '>
                        Welcome to MCP System
                    </h1>
                    <p className='mt-6 text-lg leading-8 text-gray-600'>

                    </p>
                    {!isAuthenticated && (
                        <div className='mt-10 flex items-center justify-center gap-x-6'>
                            <Link
                              to="/register"
                              className='rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                            
                            >
                                Get Started
                            </Link>

                            <Link to="/login" className='text-sm font-semibold leading-6 text-gray-900'>
                              Sign in <span></span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {isAuthenticated && (
                <div className='mt-12 px-4'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Quick Actions</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        <Link
                          to="/profile"
                          className='block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50'
                        >
                            <div className='flex items-center gap-4'>
                                <div className='p-3 bg-blue-100 rounded-full'>
                                    <FiUser className="h-6 w-6 text-blue-600"/>
                                </div>
                                <div>
                                    <h3 className='text-lg font-semibold'>Profile</h3>
                                    <p className='text-gray-600'>View and edit your profile</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                          to="/wallet"
                          className='block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50' 
                        >
                            <div>
                                <div>
                                    <FiCreditCard />
                                </div>
                            </div>
                        </Link>

                    </div>
                </div>
            )}
        </div>
    )
}