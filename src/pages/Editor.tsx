import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
// import { ResumeEditor } from "@/components/resume/ResumeEditor";
// import { ResumePreview } from "@/components/resume/ResumePreview";
// import { ResumeTips } from "@/components/resume/ResumeTips";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Save } from "lucide-react";
import { supabase } from "@/integration/supabase/client";
import type { ResumeData } from "@/types/resume";
import type { Session } from "@supabase/supabase-js";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ResumeTips } from "@/components/resume/ResumeTips";
// import { Session } from "@supabase/supabase-js";
// import { ResumeData } from "@/types/resume";

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState<Session | null>(null);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                navigate("/auth");
            }
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (!session) {
                navigate("/auth");
            }
        });
    }, [navigate]);

    useEffect(() => {
        if (session && id) {
            fetchResume();
        }
    }, [session, id]);

    const fetchResume = async () => {
        try {
            const { data, error } = await supabase
                .from("resumes")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;

            // Transform database JSON to typed arrays
            const transformedData: ResumeData = {
                ...data,
                template_type: data.template_type as "professional" | "it" | "marketing" | "design",
                work_experience: (data.work_experience as any) || [],
                education: (data.education as any) || [],
                skills: (data.skills as any) || [],
                custom_sections: (data.custom_sections as any) || [],
            };

            setResumeData(transformedData);
        } catch (error: any) {
            toast.error("Failed to load resume");
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    const saveResume = useCallback(async (data: ResumeData) => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from("resumes")
                .update({
                    ...data,
                    last_saved_at: new Date().toISOString(),
                })
                .eq("id", id);

            if (error) throw error;
            toast.success("Resume saved!", { duration: 2000 });
        } catch (error: any) {
            toast.error("Failed to save resume");
        } finally {
            setSaving(false);
        }
    }, [id]);

    // Auto-save every 30 seconds
    useEffect(() => {
        if (!resumeData) return;

        const autoSaveInterval = setInterval(() => {
            saveResume(resumeData);
        }, 30000);

        return () => clearInterval(autoSaveInterval);
    }, [resumeData, saveResume]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading resume...</p>
                </div>
            </div>
        );
    }

    if (!resumeData) return null;

    return (
        <div className="min-h-screen bg-gradient-subtle">
            <header className="border-b bg-card shadow-soft sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-2">
                        {saving && <span className="text-sm text-muted-foreground">Saving...</span>}
                        <Button variant="outline" onClick={() => saveResume(resumeData)}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Now
                        </Button>
                        <Button
                            onClick={async () => {
                                const preview = document.getElementById("resume-preview") as HTMLElement | null;
                                if (!preview) return toast.error("Could not find resume preview");

                                try {
                                    // Use html-to-image instead of html2canvas to avoid OKLCH parsing errors
                                    const { toPng } = await import("html-to-image");

                                    // Optional: temporarily neutralize gradients/shadows (extra safety)
                                    preview.classList.add("export-safe");
                                    const helperStyle = document.createElement("style");
                                    helperStyle.setAttribute("data-export-style", "true");
                                    helperStyle.textContent = `
        #resume-preview.export-safe, #resume-preview.export-safe * {
          background-image: none !important;
          box-shadow: none !important;
        }
      `;
                                    document.head.appendChild(helperStyle);

                                    // Render to PNG (2x for sharpness)
                                    const dataUrl = await toPng(preview, {
                                        pixelRatio: 2,
                                        cacheBust: true,
                                    });

                                    // Cleanup the temporary class/styles
                                    preview.classList.remove("export-safe");
                                    document.head.querySelector('style[data-export-style="true"]')?.remove();

                                    // Drop the image into a PDF
                                    const jsPDF = (await import("jspdf")).default;
                                    const pdf = new jsPDF("p", "mm", "a4");

                                    // Create an image to measure natural dimensions
                                    const img = new Image();
                                    img.src = dataUrl;
                                    await new Promise((res, rej) => {
                                        img.onload = () => res(null);
                                        img.onerror = rej;
                                    });

                                    // Fit image to A4 width, keep aspect
                                    const pageWidth = 210; // mm
                                    const imgWidthPx = img.naturalWidth;
                                    const imgHeightPx = img.naturalHeight;
                                    const imgHeightMm = (imgHeightPx * pageWidth) / imgWidthPx;

                                    pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, imgHeightMm);
                                    pdf.save(`${resumeData?.title || "resume"}.pdf`);

                                    toast.success("Resume exported successfully!");
                                } catch (error) {
                                    console.error("Export error:", error);
                                    toast.error("Failed to export resume");
                                }
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>


                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4">
                        <ResumeEditor
                            data={resumeData}
                            onChange={(newData) => setResumeData(newData)}
                        />
                    </div>
                    <div className="lg:col-span-5">
                        <ResumePreview data={resumeData} />
                    </div>
                    <div className="lg:col-span-3">
                        <ResumeTips data={resumeData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
