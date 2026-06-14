import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FcGoogle } from 'react-icons/fc'
import { IoSparkles } from 'react-icons/io5'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase'
import axios from 'axios'
import { ServerUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import lImg from '../assets/travel.png'

function Auth({ isModel = false, defaultTab }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { userData } = useSelector((state) => state.user)

    // For standalone page: read ?tab= from URL. For modal: use defaultTab prop.
    const searchParams = new URLSearchParams(location.search)
    const initialTab = defaultTab || searchParams.get('tab') || 'login'

    // 'login' | 'register' | 'google'
    const [tab, setTab] = useState(initialTab)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // ── Email verification (OTP / link) ─────────────────────────────────────
    const [verifyEmail, setVerifyEmail] = useState(null) // set when verification is required
    const [otp, setOtp] = useState('')
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [verifyError, setVerifyError] = useState('')
    const [verifyInfo, setVerifyInfo] = useState('')

    // If already logged in and on the standalone /auth page, go home
    useEffect(() => {
        if (!isModel && userData) {
            navigate('/', { replace: true })
        }
    }, [userData, isModel, navigate])

    const reset = () => {
        setName('')
        setEmail('')
        setPassword('')
        setError('')
        setShowPass(false)
    }

    const switchTab = (t) => {
        reset()
        setTab(t)
    }

    // After any successful auth on standalone page, go home
    const onAuthSuccess = (data) => {
        dispatch(setUserData(data))
        if (!isModel) {
            navigate('/', { replace: true })
        }
    }

    // ── Google ────────────────────────────────────────────────────────────────
    const handleGoogleAuth = async () => {
        setError('')
        setLoading(true)
        try {
            const response = await signInWithPopup(auth, provider)
            const { displayName: gName, email: gEmail } = response.user
            const result = await axios.post(
                ServerUrl + '/api/auth/google',
                { name: gName, email: gEmail },
                { withCredentials: true }
            )
            onAuthSuccess(result.data)
        } catch (err) {
            setError('Google sign-in failed. Please try again.')
            dispatch(setUserData(null))
        } finally {
            setLoading(false)
        }
    }

    // ── Register ──────────────────────────────────────────────────────────────
    const handleRegister = async () => {
        setError('')
        if (!name.trim() || !email.trim() || !password.trim()) {
            return setError('All fields are required.')
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters.')
        }
        setLoading(true)
        try {
            const result = await axios.post(
                ServerUrl + '/api/auth/register',
                { name, email, password },
                { withCredentials: true }
            )
            if (result.data?.requiresVerification) {
                setVerifyError('')
                setVerifyInfo("We've sent a verification code and link to your email.")
                setOtp('')
                setVerifyEmail(result.data.email || email)
            } else {
                onAuthSuccess(result.data)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    const handleLogin = async () => {
        setError('')
        if (!email.trim() || !password.trim()) {
            return setError('Email and password are required.')
        }
        setLoading(true)
        try {
            const result = await axios.post(
                ServerUrl + '/api/auth/login',
                { email, password },
                { withCredentials: true }
            )
            onAuthSuccess(result.data)
        } catch (err) {
            const data = err.response?.data
            if (data?.requiresVerification) {
                setVerifyError('')
                setVerifyInfo(data.message || 'Please verify your email to continue.')
                setOtp('')
                setVerifyEmail(data.email || email)
            } else {
                setError(data?.message || 'Login failed.')
            }
        } finally {
            setLoading(false)
        }
    }

    // ── Verify OTP ────────────────────────────────────────────────────────────
    const handleVerifyOtp = async () => {
        setVerifyError('')
        if (!otp.trim() || otp.trim().length !== 6) {
            return setVerifyError('Please enter the 6-digit code from your email.')
        }
        setVerifyLoading(true)
        try {
            const result = await axios.post(
                ServerUrl + '/api/auth/verify-otp',
                { email: verifyEmail, otp: otp.trim() },
                { withCredentials: true }
            )
            onAuthSuccess(result.data)
        } catch (err) {
            setVerifyError(err.response?.data?.message || 'Verification failed.')
        } finally {
            setVerifyLoading(false)
        }
    }

    // ── Resend OTP / Link ─────────────────────────────────────────────────────
    const handleResendOtp = async () => {
        setVerifyError('')
        setVerifyInfo('')
        setResendLoading(true)
        try {
            const result = await axios.post(
                ServerUrl + '/api/auth/resend-otp',
                { email: verifyEmail }
            )
            setVerifyInfo(result.data?.message || 'A new code has been sent to your email.')
        } catch (err) {
            setVerifyError(err.response?.data?.message || 'Failed to resend code.')
        } finally {
            setResendLoading(false)
        }
    }

    // ── Back to login from verify screen ─────────────────────────────────────
    const backToLogin = () => {
        setVerifyEmail(null)
        setOtp('')
        setVerifyError('')
        setVerifyInfo('')
        switchTab('login')
    }

    // ─────────────────────────────────────────────────────────────────────────

    const tabs = [
        { key: 'login', label: 'Login' },
        { key: 'register', label: 'Register' },
        { key: 'google', label: 'Google' },
    ]

    return (
        <div
            className={`w-full ${
                isModel
                    ? 'py-4'
                    : 'min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'
            }`}
        >
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`w-full ${
                    isModel ? 'max-w-md p-8 rounded-3xl' : 'max-w-lg p-12 rounded-[32px]'
                } bg-white shadow-2xl border border-gray-200`}
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <img src={lImg} alt="IntervIQ Logo" className="w-8 h-8 object-contain" />
                    <span className="text-xl font-bold">Cogniva</span>
                </div>

                {verifyEmail ? (
                    <motion.div
                        key="verify"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-4"
                    >
                        <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-1">
                            Verify your{' '}
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-1">
                                <IoSparkles size={15} />
                                email
                            </span>
                        </h1>
                        <p className="text-gray-500 text-center text-sm">
                            We've sent a 6-digit code and a verification link to{' '}
                            <span className="font-medium text-gray-700">{verifyEmail}</span>.
                            Enter the code below, or click the link in your inbox — either one logs you in automatically.
                        </p>

                        <AnimatePresence>
                            {verifyError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
                                >
                                    {verifyError}
                                </motion.div>
                            )}
                            {verifyInfo && !verifyError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl"
                                >
                                    {verifyInfo}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                                placeholder="••••••"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-center tracking-[0.5em] font-semibold focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                            />
                        </div>

                        <motion.button
                            onClick={handleVerifyOtp}
                            disabled={verifyLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-black text-white py-3 rounded-full text-sm font-medium shadow-md disabled:opacity-60 mt-1"
                        >
                            {verifyLoading ? 'Verifying…' : 'Verify & Continue'}
                        </motion.button>

                        <div className="flex items-center justify-between text-sm">
                            <button
                                onClick={backToLogin}
                                className="text-gray-500 hover:underline"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleResendOtp}
                                disabled={resendLoading}
                                className="text-green-600 font-medium hover:underline disabled:opacity-60"
                            >
                                {resendLoading ? 'Sending…' : 'Resend code'}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                <>
                {/* Headline */}
                <h1 className="text-2xl md:text-3xl font-semibold text-center leading-snug mb-2">
                    Continue with{' '}
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-1">
                        <IoSparkles size={15} />
                        AI Interviews
                    </span>
                </h1>
                <p className="text-gray-500 text-center text-sm mb-7">
                    Practice smarter. Get hired faster.
                </p>

                {/* Tab switcher */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-7">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => switchTab(t.key)}
                            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                                tab === t.key
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Error */}
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

                {/* ── Login Tab ── */}
                <AnimatePresence mode="wait">
                    {tab === 'login' && (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-green-600 hover:underline font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                        placeholder="••••••••"
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

                            <motion.button
                                onClick={handleLogin}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-black text-white py-3 rounded-full text-sm font-medium shadow-md disabled:opacity-60 mt-1"
                            >
                                {loading ? 'Signing in…' : 'Login'}
                            </motion.button>

                            <p className="text-center text-sm text-gray-500">
                                No account?{' '}
                                <button
                                    onClick={() => switchTab('register')}
                                    className="text-green-600 font-medium hover:underline"
                                >
                                    Register
                                </button>
                            </p>
                        </motion.div>
                    )}

                    {/* ── Register Tab ── */}
                    {tab === 'register' && (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
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

                            <motion.button
                                onClick={handleRegister}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-black text-white py-3 rounded-full text-sm font-medium shadow-md disabled:opacity-60 mt-1"
                            >
                                {loading ? 'Creating account…' : 'Create Account'}
                            </motion.button>

                            <p className="text-center text-sm text-gray-500">
                                Already have an account?{' '}
                                <button
                                    onClick={() => switchTab('login')}
                                    className="text-green-600 font-medium hover:underline"
                                >
                                    Login
                                </button>
                            </p>
                        </motion.div>
                    )}

                    {/* ── Google Tab ── */}
                    {tab === 'google' && (
                        <motion.div
                            key="google"
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center gap-5 py-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                                <FcGoogle size={32} />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-gray-800 mb-1">Sign in with Google</p>
                                <p className="text-sm text-gray-500">
                                    Quick and secure — no password needed.
                                </p>
                            </div>
                            <motion.button
                                onClick={handleGoogleAuth}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md text-sm font-medium disabled:opacity-60"
                            >
                                <FcGoogle size={18} />
                                {loading ? 'Connecting…' : 'Continue with Google'}
                            </motion.button>
                            <p className="text-center text-sm text-gray-500">
                                Prefer email?{' '}
                                <button
                                    onClick={() => switchTab('login')}
                                    className="text-green-600 font-medium hover:underline"
                                >
                                    Login with password
                                </button>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
                </>
                )}
            </motion.div>
        </div>
    )
}

export default Auth