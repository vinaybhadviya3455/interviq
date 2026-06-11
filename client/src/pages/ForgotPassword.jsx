import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { IoSparkles } from 'react-icons/io5'
import { MdOutlineMarkEmailRead } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import lImg from '../assets/travel.png'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isGoogleAccount, setIsGoogleAccount] = useState(false)
    const [sent, setSent] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError('')
        setIsGoogleAccount(false)
        if (!email.trim()) return setError('Please enter your email address.')

        setLoading(true)
        try {
            await axios.post(ServerUrl + '/api/auth/forgot-password', { email })
            setSent(true)
        } catch (err) {
            const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
            // Detect Google account error specifically
            if (err.response?.status === 400 && msg.toLowerCase().includes('google')) {
                setIsGoogleAccount(true)
            } else {
                setError(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    // Navigate to home page and open the auth modal on the Google tab
    const goToGoogleSignIn = () => {
        navigate('/?showAuth=true&tab=google')
    }

    // Navigate to home page and open the auth modal on login tab
    const goToLogin = () => {
        navigate('/?showAuth=true')
    }

    return (
        <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg p-12 rounded-[32px] bg-white shadow-2xl border border-gray-200"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <img src={lImg} alt="Cogniva Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold">Cogniva</span>
                </div>

                <AnimatePresence mode="wait">

                    {/* Google account detected */}
                    {isGoogleAccount && (
                        <motion.div
                            key="google"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center gap-4 py-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                                <FcGoogle size={32} />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Google Account</h2>
                            <p className="text-gray-500 text-sm max-w-sm">
                                <strong>{email}</strong> is linked to Google sign-in. You don't have a password — just continue with Google to log in.
                            </p>
                            <button
                                onClick={goToGoogleSignIn}
                                className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md text-sm font-medium"
                            >
                                <FcGoogle size={18} />
                                Go to Google Sign In
                            </button>
                            <button
                                onClick={() => { setIsGoogleAccount(false); setEmail('') }}
                                className="text-sm text-gray-400 hover:text-gray-600"
                            >
                                Try a different email
                            </button>
                        </motion.div>
                    )}

                    {/* Email sent success */}
                    {!isGoogleAccount && sent && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center gap-4 py-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                                <MdOutlineMarkEmailRead size={32} className="text-green-500" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Check your inbox</h2>
                            <p className="text-gray-500 text-sm max-w-sm">
                                If an account with <strong>{email}</strong> exists, we've sent a password reset link. It expires in 1 hour.
                            </p>
                            <p className="text-gray-400 text-xs">
                                Didn't get it? Check your spam folder or{' '}
                                <button
                                    onClick={() => { setSent(false); setEmail('') }}
                                    className="text-green-600 font-medium hover:underline"
                                >
                                    try again
                                </button>
                                .
                            </p>
                            <button
                                onClick={goToLogin}
                                className="mt-2 text-sm text-gray-600 hover:text-black font-medium hover:underline"
                            >
                                Back to Login
                            </button>
                        </motion.div>
                    )}

                    {/* Form */}
                    {!isGoogleAccount && !sent && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-2">
                                Forgot your{' '}
                                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-1">
                                    <IoSparkles size={15} />
                                    password?
                                </span>
                            </h1>
                            <p className="text-gray-500 text-center text-sm mb-7">
                                Enter your email and we'll send you a reset link.
                            </p>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                        placeholder="you@example.com"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                    />
                                </div>

                                <motion.button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-black text-white py-3 rounded-full text-sm font-medium shadow-md disabled:opacity-60 mt-1"
                                >
                                    {loading ? 'Sending…' : 'Send Reset Link'}
                                </motion.button>

                                <p className="text-center text-sm text-gray-500">
                                    Remember your password?{' '}
                                    <button
                                        onClick={goToLogin}
                                        className="text-green-600 font-medium hover:underline"
                                    >
                                        Back to Login
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export default ForgotPassword