import { Button } from "@/components/ui/button";
import { supabase } from "@/integration/supabase/client";
import { FileText, Zap, Download, Shield, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { supabase } from "@/";

const FeatureCard = ({
    icon,
    title,
    desc,
    tone = "primary",
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    tone?: "primary" | "accent";
}) => (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tone === "primary"
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "bg-emerald-100 dark:bg-emerald-900/30"
                }`}
        >
            {icon}
        </div>
        <h3 className="mb-1 text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>

        {/* subtle focus/hover ring */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-blue-500/0 transition group-hover:ring-2 group-hover:ring-blue-500/10" />
    </div>
);

const Index = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
        });
    }, []);

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate("/dashboard");
        } else {
            navigate("/auth");
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white dark:from-gray-950 dark:via-gray-950 dark:to-black">
            {/* Hero */}
            <header className="container mx-auto px-4 pt-20 pb-16 md:pt-24 md:pb-20">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium">AI-Powered Resume Builder</span>
                    </div>

                    <h1 className="bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400 md:text-6xl">
                        Build Your Perfect Resume in Minutes
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-400 md:mt-6 md:text-lg">
                        Create professional, job-specific resumes with real-time tips,
                        auto-save, and instant preview. Export in multiple formats and stand
                        out from the crowd.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button size="lg" className="text-base md:text-lg" onClick={handleGetStarted}>
                            <FileText className="mr-2 h-5 w-5" />
                            Get Started Free
                        </Button>
                        <Button size="lg" variant="outline" className="text-base md:text-lg" onClick={handleGetStarted}>
                            <Download className="mr-2 h-5 w-5" />
                            View Samples
                        </Button>
                    </div>

                    {/* subtle divider */}
                    <div className="mx-auto mt-12 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
                </div>

                {/* Feature grid */}
                <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FeatureCard
                        icon={<Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                        title="Real-Time Tips"
                        desc="Get instant feedback and suggestions as you build your resume."
                        tone="primary"
                    />
                    <FeatureCard
                        icon={<Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
                        title="Auto-Save"
                        desc="Never lose progress with automatic cloud saving."
                        tone="accent"
                    />
                    <FeatureCard
                        icon={<FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                        title="Job-Specific Templates"
                        desc="Choose from IT, Marketing, Design, and Professional templates."
                        tone="primary"
                    />
                    <FeatureCard
                        icon={<Download className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
                        title="Multiple Exports"
                        desc="Download as PDF, LinkedIn-ready format, or share via QR code."
                        tone="accent"
                    />
                </div>
            </header>

            {/* CTA */}
            <section className="relative">
                <div className="container mx-auto px-4 pb-20">
                    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg dark:border-gray-800">
                        {/* pattern/overlay */}
                        <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(1200px_600px_at_100%_0%,white,transparent_50%)]" />
                        <div className="relative z-10 px-6 py-12 text-center text-white md:px-12 md:py-16">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                                Ready to Land Your Dream Job?
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl text-base text-white/90 md:text-lg">
                                Join thousands of professionals who have created stunning
                                resumes with our platform.
                            </p>
                            <div className="mt-8">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="text-base md:text-lg"
                                >
                                    Start Building Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;
