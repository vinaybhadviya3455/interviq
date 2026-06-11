import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { IoSparkles } from 'react-icons/io5'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { MdLockReset } from 'react-icons/md'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'
import lImg from '../assets/travel.png'

function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [validating, setValidating] = useState(true)
    const [tokenValid, setTokenValid] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Validate token on mount
    useEffect(() => {
        if (!token) {
            setValidating(false)
            setTokenValid(false)
            return
        }

        const validate = async () => {
            try {
                await axios.get(ServerUrl + `/api/auth/validate-reset-token?token=${token}`)
                setTokenValid(true)
            } catch {
                setTokenValid(false)
            } finally {
                setValidating(false)
            }
        }
        validate()
    }, [token])

    const handleSubmit = async () => {
        setError('')

        if (!password || !confirmPassword) return setError('Please fill in both fields.')
        if (password.length < 6) return setError('Password must be at least 6 characters.')
        if (password !== confirmPassword) return setError('Passwords do not match.')

        setLoading(true)
        try {
            await axios.post(ServerUrl + '/api/auth/reset-password', { token, password })
            setSuccess(true)
            setTimeout(() => navigate('/?showAuth=true&tab=login'), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (validating) {
        return (
            <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
                <div className="text-gray-400 text-sm animate-pulse">Validating reset link…</div>
            </div>
        )
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
                    {/* Invalid token */}
                    {!tokenValid && (
                        <motion.div
                            key="invalid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center text-center gap-4 py-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                                <MdLockReset size={32} className="text-red-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Link expired</h2>
                            <p className="text-gray-500 text-sm max-w-sm">
                                This password reset link is invalid or has expired. Reset links are valid for 1 hour.
                            </p>
                            <Link
                                to="/forgot-password"
                                className="mt-2 inline-block bg-black text-white py-3 px-8 rounded-full text-sm font-medium"
                            >
                                Request a new link
                            </Link>
                        </motion.div>
                    )}

                    {/* Success */}
                    {tokenValid && success && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center gap-4 py-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                                <MdLockReset size={32} className="text-green-500" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Password updated!</h2>
                            <p className="text-gray-500 text-sm">
                                Your password has been changed. Redirecting you to login…
                            </p>
                            <Link to="/?showAuth=true&tab=login" className="text-green-600 font-medium hover:underline text-sm">
                                Go to Login
                            </Link>
                        </motion.div>
                    )}

                    {/* Reset form */}
                    {tokenValid && !success && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-2">
                                Set a new{' '}
                                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-1">
                                    <IoSparkles size={15} />
                                    password
                                </span>
                            </h1>
                            <p className="text-gray-500 text-center text-sm mb-7">
                                Choose a strong password with at least 6 characters.
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
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Min. 6 characters"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition pr-11"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPass(!showPass)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPass ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                            placeholder="Repeat your password"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition pr-11"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirm ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <motion.button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-black text-white py-3 rounded-full text-sm font-medium shadow-md disabled:opacity-60 mt-1"
                                >
                                    {loading ? 'Updating password…' : 'Update Password'}
                                </motion.button>

                                <p className="text-center text-sm text-gray-500">
                                    <Link to="/?showAuth=true&tab=login" className="text-green-600 font-medium hover:underline">
                                    Back to Login
                                </Link>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export default ResetPassword