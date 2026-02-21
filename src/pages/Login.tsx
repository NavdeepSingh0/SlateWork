import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Layers, FileText, Search, History } from 'lucide-react';

const features = [
    { icon: FileText, text: 'Rich Markdown article editor' },
    { icon: CheckCircle, text: 'Approval workflow with roles' },
    { icon: Search, text: 'Full-text search across everything' },
    { icon: History, text: 'Version history & diff viewer' },
];

export function LoginPage() {
    const { signIn, signUp, user, loading } = useAuth();
    const [searchParams] = useSearchParams();
    const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmationSent, setConfirmationSent] = useState(false);

    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        if (isSignUp) {
            if (!fullName.trim()) {
                setError('Full name is required');
                setSubmitting(false);
                return;
            }
            const { error: err } = await signUp(email, password, fullName);
            if (err) {
                setError(err);
            } else {
                setConfirmationSent(true);
            }
        } else {
            const { error: err } = await signIn(email, password);
            if (err) {
                setError(err);
            }
        }

        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-text-muted border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* ── Left panel — brand & feature showcase ── */}
            <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-12 relative overflow-hidden">
                {/* Background grid */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />
                {/* Glow blob */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/[0.04] blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center shadow-lg">
                        <Layers className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">SlateWork</span>
                </div>

                {/* Centre text */}
                <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                        The centralized hub<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 to-white/40">
                            for your team's knowledge.
                        </span>
                    </h1>
                    <p className="text-[#A3A3A3] text-base font-medium mb-10 leading-relaxed max-w-sm">
                        Unify documentation, discussions, and decisions — all in one place, with real-time collaboration.
                    </p>

                    {/* Feature list */}
                    <ul className="space-y-4">
                        {features.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm text-[#C9C9C9] font-medium">{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bottom quote */}
                <div className="relative z-10 border-t border-white/10 pt-6">
                    <p className="text-sm text-[#888] italic leading-relaxed">
                        "SlateWork transformed how we share knowledge and collaborate."
                    </p>
                    <p className="text-xs text-[#555] mt-2 font-semibold uppercase tracking-wider">— Sarah Chen, VP Engineering</p>
                </div>
            </div>

            {/* ── Right panel — form ── */}
            <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 sm:p-12">
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                        <Layers className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-text-primary font-bold text-lg tracking-tight">SlateWork</span>
                </div>

                <div className="w-full max-w-sm">
                    {confirmationSent ? (
                        <div className="bg-surface border border-surface-border rounded-xl p-8 text-center">
                            <div className="w-12 h-12 bg-status-published-bg rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-status-published-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-text-primary font-semibold text-lg mb-2">Check your email</h2>
                            <p className="text-text-muted text-sm mb-6">
                                We sent a confirmation link to <span className="text-text-secondary">{email}</span>
                            </p>
                            <button
                                onClick={() => { setConfirmationSent(false); setIsSignUp(false); }}
                                className="text-sm text-text-primary hover:underline"
                            >
                                Back to sign in
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Heading */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                                    {isSignUp ? 'Create your account' : 'Welcome back'}
                                </h2>
                                <p className="text-text-muted text-sm mt-1">
                                    {isSignUp
                                        ? 'Start collaborating with your team today.'
                                        : 'Sign in to continue to SlateWork.'}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isSignUp && (
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Alex Morgan"
                                            className="w-full h-11 px-3 bg-surface border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full h-11 px-3 bg-surface border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full h-11 px-3 bg-surface border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                {error && (
                                    <div className="px-3 py-2.5 bg-status-error-bg border border-status-error-text/20 rounded-lg">
                                        <p className="text-sm text-status-error-text">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-11 bg-white rounded-lg text-sm font-semibold text-black hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        isSignUp ? 'Create Account' : 'Sign In'
                                    )}
                                </button>
                            </form>

                            {/* Toggle */}
                            <p className="text-center text-sm text-text-muted mt-6">
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                                <button
                                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                    className="text-text-primary font-medium hover:underline"
                                >
                                    {isSignUp ? 'Sign in' : 'Sign up'}
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
