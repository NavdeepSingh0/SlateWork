import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Layers, FileText, Search, History, Users } from 'lucide-react';

const features = [
    { icon: FileText, text: 'Rich Markdown article editor' },
    { icon: CheckCircle, text: 'Approval workflow with roles' },
    { icon: Search, text: 'Full-text search across everything' },
    { icon: History, text: 'Version history & diff viewer' },
];

const stats = [
    { value: '10k+', label: 'Articles' },
    { value: '500+', label: 'Teams' },
    { value: '99.9%', label: 'Uptime' },
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
        <div className="h-screen w-full flex overflow-hidden bg-background">

            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-10 xl:p-14 relative overflow-y-auto custom-scrollbar">
                {/* Grid background */}
                <div
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />
                {/* Glow blobs */}
                <div className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-white/[0.05] blur-[130px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/[0.03] blur-[110px] rounded-full pointer-events-none" />

                {/* Logo — bigger */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white rounded-xl flex items-center justify-center shadow-xl shadow-white/10">
                        <Layers className="w-6 h-6 xl:w-7 xl:h-7 text-black" />
                    </div>
                    <span className="text-white font-bold text-xl xl:text-2xl tracking-tight">SlateWork</span>
                </div>

                {/* Centre content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 xl:mb-5">
                        The centralized hub<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 to-white/30">
                            for your team's knowledge.
                        </span>
                    </h1>
                    <p className="text-[#A3A3A3] text-sm xl:text-base font-medium mb-8 xl:mb-10 leading-relaxed max-w-sm">
                        Unify documentation, discussions, and decisions — all in one place, with real-time collaboration and role-based access.
                    </p>

                    {/* Feature list */}
                    <ul className="space-y-3">
                        {features.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-3.5">
                                <div className="w-8 h-8 xl:w-9 xl:h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm text-[#C9C9C9] font-medium">{text}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Stats row */}
                    <div className="flex gap-6 mt-8 xl:mt-10 pt-6 xl:pt-8 border-t border-white/10">
                        {stats.map(({ value, label }) => (
                            <div key={label}>
                                <p className="text-xl xl:text-2xl font-black text-white tracking-tight">{value}</p>
                                <p className="text-[10px] xl:text-xs text-[#666] uppercase tracking-widest font-semibold mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom quote */}
                <div className="relative z-10 border-t border-white/10 pt-6">
                    <p className="text-xs xl:text-sm text-[#888] italic leading-relaxed">
                        "SlateWork transformed how we share knowledge and collaborate across engineering."
                    </p>
                    <p className="text-[10px] xl:text-xs text-[#555] mt-2 font-semibold uppercase tracking-wider">— Sarah Chen, VP Engineering · ACME Corp</p>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="flex-1 bg-background relative overflow-y-auto custom-scrollbar">
                <div className="min-h-full flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-hidden">
                    {/* Subtle right-side glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8 relative z-10 w-full max-w-sm">
                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                            <Layers className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-text-primary font-bold text-xl tracking-tight">SlateWork</span>
                    </div>

                    <div className="w-full max-w-sm relative z-10 my-auto">
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
                                <div className="mb-6 xl:mb-8">
                                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                                        {isSignUp ? 'Create your account' : 'Welcome back'}
                                    </h2>
                                    <p className="text-text-muted text-sm mt-1.5">
                                        {isSignUp
                                            ? 'Start collaborating with your team today.'
                                            : 'Sign in to continue to SlateWork.'}
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-3.5 xl:space-y-4">
                                    {isSignUp && (
                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Alex Morgan"
                                                className="w-full h-10 xl:h-11 px-3.5 bg-surface border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full h-10 xl:h-11 px-3.5 bg-surface border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-10 xl:h-11 px-3.5 bg-surface border border-surface-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    {error && (
                                        <div className="px-3.5 py-2 xl:py-2.5 bg-status-error-bg border border-status-error-text/20 rounded-lg">
                                            <p className="text-sm text-status-error-text">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full h-10 xl:h-11 bg-white rounded-lg text-sm font-semibold text-black hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                                    >
                                        {submitting ? (
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            isSignUp ? 'Create Account' : 'Sign In'
                                        )}
                                    </button>
                                </form>

                                {/* Toggle */}
                                <p className="text-center text-sm text-text-muted mt-5">
                                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                                    <button
                                        onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                        className="text-text-primary font-medium hover:underline focus:outline-none"
                                    >
                                        {isSignUp ? 'Sign in' : 'Sign up'}
                                    </button>
                                </p>

                                {/* Social proof chips */}
                                <div className="mt-8 xl:mt-10 pt-6 xl:pt-8 border-t border-surface-border">
                                    <div className="flex items-center justify-center gap-1.5 mb-4">
                                        <div className="flex -space-x-2">
                                            {['A', 'R', 'S', 'M'].map((initial, i) => (
                                                <div
                                                    key={i}
                                                    className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-surface border-2 border-background flex items-center justify-center text-[9px] xl:text-[10px] font-bold text-text-secondary"
                                                    style={{ zIndex: 4 - i }}
                                                >
                                                    {initial}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[11px] xl:text-xs text-text-muted ml-2 font-medium">
                                            Joined by <span className="text-text-secondary font-semibold">500+ teams</span> worldwide
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { icon: FileText, label: '10k+ Articles' },
                                            { icon: Users, label: '500+ Teams' },
                                            { icon: CheckCircle, label: 'Free to start' },
                                        ].map(({ icon: Icon, label }) => (
                                            <div key={label} className="flex flex-col items-center gap-1 xl:gap-1.5 p-2 xl:p-3 rounded-lg bg-surface border border-surface-border">
                                                <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-text-muted" />
                                                <span className="text-[10px] xl:text-[11px] text-text-muted text-center font-medium leading-tight">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
