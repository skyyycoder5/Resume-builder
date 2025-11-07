import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Plus, LogOut, Trash2 } from "lucide-react";
import { supabase } from "@/integration/supabase/client";
import type { Session } from "@supabase/supabase-js";

type Resume = {
    id: string;
    title: string;
    template_type: string;
    updated_at: string;
};

const Dashboard = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) navigate("/auth");
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (!session) navigate("/auth");
        });

        return () => {
            sub.subscription.unsubscribe();
        };
    }, [navigate]);

    useEffect(() => {
        if (session) fetchResumes();
    }, [session]);

    const fetchResumes = async () => {
        try {
            const { data, error } = await supabase
                .from("resumes")
                .select("*")
                .order("updated_at", { ascending: false });

            if (error) throw error;
            setResumes(data || []);
        } catch {
            toast.error("Failed to load resumes");
        } finally {
            setLoading(false);
        }
    };

    const createResume = async () => {
        try {
            const { data, error } = await supabase
                .from("resumes")
                .insert([{ user_id: session?.user.id, title: "Untitled Resume" }])
                .select()
                .single();

            if (error) throw error;
            toast.success("Resume created!");
            navigate(`/editor/${data.id}`);
        } catch {
            toast.error("Failed to create resume");
        }
    };

    const deleteResume = async (id: string) => {
        try {
            const { error } = await supabase.from("resumes").delete().eq("id", id);
            if (error) throw error;
            toast.success("Resume deleted");
            fetchResumes();
        } catch {
            toast.error("Failed to delete resume");
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-950 dark:to-black">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-950 dark:to-black">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-lg shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg p-2 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Resume Builder
                        </h1>
                    </div>
                    <Button variant="ghost" onClick={handleSignOut} className="text-gray-700 dark:text-gray-300">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </header>

            {/* Main */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Your Resumes</h2>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Create and manage your professional resumes
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Create New */}
                    <Card
                        className="cursor-pointer border-2 border-dashed border-gray-300 bg-white/70 transition-all hover:border-blue-600 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/70"
                        onClick={createResume}
                    >
                        <CardContent className="flex h-64 flex-col items-center justify-center text-center">
                            <div className="mb-4 rounded-full bg-blue-100 p-4 transition-transform group-hover:scale-110 dark:bg-blue-900/30">
                                <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create New Resume</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Start building your professional resume
                            </p>
                        </CardContent>
                    </Card>

                    {/* Existing Resumes */}
                    {resumes.map((resume) => (
                        <Card
                            key={resume.id}
                            className="group relative cursor-pointer border border-gray-200 bg-white/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
                        >
                            <CardHeader onClick={() => navigate(`/editor/${resume.id}`)} className="pb-2">
                                <CardTitle className="line-clamp-1 text-gray-900 dark:text-gray-100">
                                    {resume.title}
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                    {new Date(resume.updated_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <Button
                                        onClick={() => navigate(`/editor/${resume.id}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Edit Resume
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteResume(resume.id);
                                        }}
                                        aria-label="Delete resume"
                                        title="Delete resume"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>

                            {/* subtle hover ring */}
                            <div className="pointer-events-none absolute inset-0 rounded-md ring-0 ring-blue-500/0 transition group-hover:ring-2 group-hover:ring-blue-500/10" />
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
