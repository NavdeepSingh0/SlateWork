import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu, X, Layout, Brain, MessageSquare,
    History, Search, CheckCircle, ArrowRight, Layers,
    Zap, Shield, Globe
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';

// Hook to trigger animations when elements scroll into view
const useScrollReveal = (options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options]);

    return [ref, isVisible] as const;
};

// Reveal Component wrapper
const Reveal = ({ children, delay = 0, className = "", direction = "up" }: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
}) => {
    const [ref, isVisible] = useScrollReveal();

    const getTransform = () => {
        switch (direction) {
            case "up": return "translateY(40px)";
            case "down": return "translateY(-40px)";
            case "left": return "translateX(40px)";
            case "right": return "translateX(-40px)";
            default: return "translateY(40px)";
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : getTransform(),
                transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

export function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, loading, navigate]);

    // Handle scroll for navbar transparency
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const goToLogin = () => navigate('/login');
    const goToSignup = () => navigate('/login?mode=signup');

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 selection:text-white overflow-x-hidden">

            {/* --- Global Styles for specific animations --- */}
            <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotateX(2deg); }
          50% { transform: translateY(-10px) rotateX(2deg); }
          100% { transform: translateY(0px) rotateX(2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glow-effect {
          box-shadow: 0 0 140px rgba(255, 255, 255, 0.09);
        }
      `}</style>

            {/* --- Navbar --- */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                            <Layers className="text-black w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">SlateWork</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#B3B3B3]">
                        <a href="#product" className="hover:text-white transition-colors">Product</a>
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </nav>

                    <div className="hidden md:flex items-center gap-6">
                        <button onClick={goToLogin} className="text-sm font-medium text-[#B3B3B3] hover:text-white transition-colors">Sign In</button>
                        <button onClick={goToSignup} className="bg-white text-black px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors">
                            Get Started
                        </button>
                    </div>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden">
                    <div className="flex flex-col gap-6 text-xl font-medium">
                        <a href="#product" onClick={() => setMobileMenuOpen(false)}>Product</a>
                        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                        <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <hr className="border-white/10" />
                        <button onClick={() => { setMobileMenuOpen(false); goToLogin(); }} className="text-[#B3B3B3] text-left">Sign In</button>
                        <button onClick={() => { setMobileMenuOpen(false); goToSignup(); }} className="bg-white text-black px-5 py-3 rounded-md text-base font-semibold w-full text-center">
                            Get Started
                        </button>
                    </div>
                </div>
            )}

            {/* --- Hero Section --- */}
            <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden flex flex-col items-center text-center px-6">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/[0.04] blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-4xl mx-auto z-10">
                    <Reveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-[#B3B3B3] mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"></span>
                            SlateWork is now available // Sign up today
                        </div>
                    </Reveal>

                    <Reveal delay={100}>
                        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-extrabold tracking-tighter leading-[1.05] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40">
                            The centralized hub <br className="hidden md:block" />
                            for your team's knowledge.
                        </h1>
                    </Reveal>

                    <Reveal delay={200}>
                        <p className="text-lg md:text-xl text-[#A3A3A3] max-w-2xl mx-auto mb-10 leading-relaxed tracking-tight font-medium">
                            Unify your team's documentation, discussions, and decisions in one place. Stop searching across scattered tools and start building faster.
                        </p>
                    </Reveal>

                    <Reveal delay={300}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button onClick={goToSignup} className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                Get Started Free <ArrowRight className="w-4 h-4" />
                            </button>
                            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 text-white font-medium rounded-md hover:bg-white/5 transition-colors text-center">
                                See How It Works
                            </a>
                        </div>
                    </Reveal>
                </div>

                {/* Dashboard Preview Image */}
                <Reveal delay={500} className="w-full max-w-6xl mx-auto mt-20 relative z-20">
                    <div
                        className="rounded-xl md:rounded-2xl overflow-hidden border border-white/10 glow-effect animate-float bg-[#0A0A0A] p-2"
                        style={{ perspective: '1200px' }}
                    >
                        <img
                            src="https://img.sanishtech.com/u/a5ab688347c9613041175e394fefea01.jpeg"
                            alt="SlateWork Dashboard Environment"
                            className="w-full h-auto rounded-lg border border-white/5 object-cover bg-[#0A0A0A]"
                        />
                    </div>
                </Reveal>
            </section>

            {/* --- Social Proof / Trust Section --- */}
            <section className="py-12 border-y border-white/5 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-bold text-[#666666] tracking-[0.2em] uppercase mb-8">
                        Powering modern engineering teams
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                        <span className="text-xl font-black tracking-tighter">ACME Corp</span>
                        <span className="text-xl font-black tracking-tighter flex items-center gap-1"><Globe className="w-5 h-5" /> GlobalTech</span>
                        <span className="text-xl font-black tracking-tighter">NEXUS</span>
                        <span className="text-xl font-black tracking-tighter flex items-center gap-1"><Zap className="w-5 h-5" /> Bolt</span>
                        <span className="text-xl font-black tracking-tighter">Horizon</span>
                    </div>
                </div>
            </section>

            {/* --- Problem Section --- */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <Reveal>
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                                    Stop losing context.<br />
                                    <span className="text-[#666666]">Bring everything together.</span>
                                </h2>
                            </Reveal>
                            <Reveal delay={100}>
                                <p className="text-lg text-[#A3A3A3] mb-8 leading-relaxed font-medium">
                                    Your team doesn't have a knowledge problem; they have an organization problem. SlateWork eliminates scattered documents and endless chat threads by creating a single, reliable source of truth.
                                </p>
                            </Reveal>
                        </div>

                        <div className="grid gap-4">
                            {[
                                { title: "Context lost in endless chat streams.", icon: <Layout className="text-[#A3A3A3]" /> },
                                { title: "Answering the same questions repeatedly.", icon: <MessageSquare className="text-[#A3A3A3]" /> },
                                { title: "Important decisions buried without context.", icon: <History className="text-[#A3A3A3]" /> },
                                { title: "Slow and frustrating team onboarding.", icon: <Search className="text-[#A3A3A3]" /> },
                            ].map((item, i) => (
                                <Reveal key={i} delay={i * 100}>
                                    <div className="flex items-center gap-5 p-6 rounded-lg border border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent">
                                        {item.icon}
                                        <span className="font-semibold text-lg text-white/90 tracking-tight">{item.title}</span>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Features Grid Section --- */}
            <section id="features" className="py-32 px-6 bg-[#030303] relative border-y border-white/5">
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <Reveal>
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Powerful Features. Simple Experience.</h2>
                            <p className="text-lg text-[#A3A3A3] max-w-2xl mx-auto font-medium">
                                Everything your team needs to document, collaborate, and ship faster—all in one intuitive platform.
                            </p>
                        </div>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Layers className="w-6 h-6" />,
                                title: "Dedicated Workspaces",
                                desc: "Organized spaces for individual teams. Keep information relevant and focus on what matters most to your workflow."
                            },
                            {
                                icon: <Brain className="w-6 h-6" />,
                                title: "Living Documentation",
                                desc: "Rich Markdown support with code blocks and bi-directional linking to keep your specifications up to date."
                            },
                            {
                                icon: <MessageSquare className="w-6 h-6" />,
                                title: "Structured Discussions",
                                desc: "Move important conversations out of chat and into threaded, searchable discussions connected directly to your work."
                            },
                            {
                                icon: <History className="w-6 h-6" />,
                                title: "Version History",
                                desc: "A complete audit trail of changes. Review granular differences and revert to previous versions instantly."
                            },
                            {
                                icon: <Search className="w-6 h-6" />,
                                title: "Fast Search",
                                desc: "Find exactly what you need in milliseconds. Our automated search quickly scans documents, threads, and metadata."
                            },
                            {
                                icon: <CheckCircle className="w-6 h-6" />,
                                title: "Review Workflows",
                                desc: "Maintain quality with built-in review processes and approvals before critical documentation is published to the team."
                            }
                        ].map((feat, i) => (
                            <Reveal key={i} delay={i * 100}>
                                <div className="group p-8 rounded-xl border border-white/10 bg-[#0A0A0A] hover:bg-[#111] hover:border-white/30 transition-all duration-500 h-full flex flex-col hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(255,255,255,0.05)]">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center mb-6 text-black group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                        {feat.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 tracking-tight">{feat.title}</h3>
                                    <p className="text-[#A3A3A3] leading-relaxed flex-grow font-medium">
                                        {feat.desc}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- How It Works Section --- */}
            <section id="how-it-works" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">How It Works</h2>
                            <p className="text-lg text-[#A3A3A3] font-medium">A simple, effective process to supercharge your team's knowledge sharing.</p>
                        </div>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        {[
                            {
                                step: "01",
                                title: "Capture Knowledge",
                                desc: "Create documents, start discussions, and collaborate seamlessly in one centralized place without context switching."
                            },
                            {
                                step: "02",
                                title: "Organize Everything",
                                desc: "Use workspaces, tags, and built-in version control to keep your repository pristine and easy to navigate."
                            },
                            {
                                step: "03",
                                title: "Find Answers Fast",
                                desc: "Use our powerful search to surface exactly what your team needs instantly, reducing repetitive questions."
                            }
                        ].map((step, i) => (
                            <Reveal key={i} delay={i * 200} className="relative z-10 text-center md:text-left group">
                                <div className="w-24 h-24 mx-auto md:mx-0 bg-black border border-white/20 rounded-full flex items-center justify-center text-3xl font-black tracking-tighter mb-8 text-white group-hover:border-white group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                                    {step.step}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h3>
                                <p className="text-[#A3A3A3] leading-relaxed font-medium">
                                    {step.desc}
                                </p>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Product Value / Quote Section --- */}
            <section className="py-32 px-6 bg-[#030303] border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <Reveal>
                        <Shield className="w-12 h-12 mx-auto text-white/40 mb-10" />
                        <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-14 text-white/90">
                            "SlateWork is the connective tissue of our engineering organization. It unified our documentation and transformed how we share knowledge."
                        </h2>
                        <div className="flex items-center justify-center gap-5">
                            <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/5 rounded-full border border-white/20 backdrop-blur-sm"></div>
                            <div className="text-left">
                                <p className="font-bold text-white tracking-tight">Sarah Chen</p>
                                <p className="text-sm text-[#A3A3A3] font-medium uppercase tracking-wider mt-1">VP of Engineering, ACME Corp</p>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* --- Value Metrics --- */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
                    {[
                        { label: "Productivity Increase", value: "+30%" },
                        { label: "Fewer Interruptions", value: "-40%" },
                        { label: "Search Speed", value: "< 50ms" },
                        { label: "Team Alignment", value: "100%" },
                    ].map((stat, i) => (
                        <Reveal key={i} delay={i * 100} className="text-center px-4">
                            <p className="text-4xl md:text-6xl font-black tracking-tighter mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{stat.value}</p>
                            <p className="text-xs md:text-sm text-[#888888] font-bold uppercase tracking-widest">{stat.label}</p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* --- Final CTA Section --- */}
            <section className="py-40 px-6 relative overflow-hidden bg-black border-t border-white/10">
                <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/[0.05] blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Reveal>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                            Ready to unify your <br />team's knowledge?
                        </h2>
                    </Reveal>
                    <Reveal delay={100}>
                        <p className="text-xl text-[#A3A3A3] mb-12 max-w-2xl mx-auto font-medium">
                            Join modern engineering teams building a lasting knowledge base and executing with absolute clarity.
                        </p>
                    </Reveal>
                    <Reveal delay={200}>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={goToSignup} className="px-10 py-5 bg-white text-black font-bold rounded-md hover:bg-gray-200 hover:scale-105 transition-all duration-300 text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                Get Started Free
                            </button>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="border-t border-white/10 bg-[#020202] pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                                <Layers className="text-black w-4 h-4" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">SlateWork</span>
                        </div>
                        <p className="text-sm text-[#888888] max-w-xs leading-relaxed font-medium">
                            The centralized knowledge base and collaboration platform for modern engineering teams.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-5 tracking-tight">Platform</h4>
                        <ul className="space-y-4 text-sm text-[#888888] font-medium">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-5 tracking-tight">Resources</h4>
                        <ul className="space-y-4 text-sm text-[#888888] font-medium">
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-5 tracking-tight">Company</h4>
                        <ul className="space-y-4 text-sm text-[#888888] font-medium">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#666666] font-medium tracking-wide">
                    <p>© {new Date().getFullYear()} SlateWork Inc. All rights reserved.</p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">X / Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
