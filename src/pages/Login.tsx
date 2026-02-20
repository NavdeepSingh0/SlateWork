import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
    const { signIn, signUp, user, loading } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [confirmationSent, setConfirmationSent] = useState(false);

    // If already logged in, redirect
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
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 42 L32 52 L56 42 L56 38 Q56 36 54 35 L34 45 Q32 46 30 45 L10 35 Q8 36 8 38 Z" fill="#FAFAFA" />
                        <path d="M8 34 L32 44 L56 34 L56 30 Q56 28 54 27 L34 37 Q32 38 30 37 L10 27 Q8 28 8 30 Z" fill="#FAFAFA" />
                        <path d="M10 19 Q8 20 8 22 L8 26 L32 36 L56 26 L56 22 Q56 20 54 19 L34 12 Q32 11 30 12 Z" fill="#FAFAFA" />
                    </svg>
                    <span className="text-text-primary font-semibold text-xl tracking-tight">SlateWork</span>
                </div>

                {/* Confirmation Message */}
                {confirmationSent ? (
                    <div className="bg-surface border border-surface-border rounded-lg p-6 text-center">
                        <div className="w-12 h-12 bg-status-published-bg rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-status-published-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-text-primary font-semibold mb-2">Check your email</h2>
                        <p className="text-text-muted text-sm mb-4">We sent a confirmation link to <span className="text-text-secondary">{email}</span></p>
                        <button
                            onClick={() => { setConfirmationSent(false); setIsSignUp(false); }}
                            className="text-sm text-text-primary hover:underline"
                        >
                            Back to sign in
                        </button>
                    </div>
                ) : (
                    <div className="bg-surface border border-surface-border rounded-lg p-6">
                        <h1 className="text-lg font-semibold text-text-primary mb-1">
                            {isSignUp ? 'Create an account' : 'Sign in'}
                        </h1>
                        <p className="text-sm text-text-muted mb-6">
                            {isSignUp ? 'Get started with SlateWork' : 'Welcome back to SlateWork'}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isSignUp && (
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Alex Morgan"
                                        className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
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
                                    className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
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
                                    className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {error && (
                                <div className="px-3 py-2 bg-status-error-bg border border-status-error-text/20 rounded-md">
                                    <p className="text-sm text-status-error-text">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-10 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {submitting ? (
                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    isSignUp ? 'Create Account' : 'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-4 pt-4 border-t border-surface-border text-center">
                            <button
                                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                className="text-sm text-text-muted hover:text-text-primary transition-colors"
                            >
                                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
