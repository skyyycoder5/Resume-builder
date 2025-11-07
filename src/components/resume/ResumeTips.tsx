import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ResumeData } from "@/types/resume";

type Props = { data: ResumeData };

type Tip = {
  type: "success" | "warning";
  message: string;
};

export const ResumeTips = ({ data }: Props) => {
  const generateTips = (): Tip[] => {
    const tips: Tip[] = [];

    // Basic info
    if (!data.full_name) tips.push({ type: "warning", message: "Add your full name to personalize your resume" });
    if (!data.email || !data.phone)
      tips.push({ type: "warning", message: "Include contact information so employers can reach you" });

    if (data.summary && data.summary.length < 100)
      tips.push({ type: "warning", message: "Expand your professional summary (aim for 2-3 sentences)" });
    if (!data.summary) tips.push({ type: "warning", message: "Add a professional summary to introduce yourself" });

    // Experience
    if (data.work_experience.length === 0) {
      tips.push({ type: "warning", message: "Add your work experience to showcase your career" });
    } else {
      tips.push({ type: "success", message: "Great! You've added work experience" });
      data.work_experience.forEach((exp, i) => {
        if (!exp.description || exp.description.length < 50) {
          tips.push({
            type: "warning",
            message: `Add more details to work experience #${i + 1} - include achievements and responsibilities`,
          });
        }
      });
    }

    // Education
    if (data.education.length === 0) tips.push({ type: "warning", message: "Add your educational background" });
    else tips.push({ type: "success", message: "Education section looks good!" });

    // Skills
    if (data.skills.length === 0) tips.push({ type: "warning", message: "List your key skills and competencies" });
    else if (data.skills.length < 5)
      tips.push({ type: "warning", message: "Add more skills - aim for 5-10 relevant skills" });
    else tips.push({ type: "success", message: "Good range of skills listed!" });

    // Socials
    if (!data.linkedin_url) tips.push({ type: "warning", message: "Add your LinkedIn profile to boost credibility" });
    if (data.portfolio_url)
      tips.push({ type: "success", message: "Portfolio link added - great for showcasing work!" });

    // Template hint
    switch (data.template_type) {
      case "it":
        tips.push({ type: "success", message: "IT template selected - perfect for technical roles" });
        break;
      case "marketing":
        tips.push({ type: "success", message: "Marketing template - great for creative impact!" });
        break;
      case "design":
        tips.push({ type: "success", message: "Design template - showcases your creative flair" });
        break;
      default:
        tips.push({ type: "success", message: "Professional template - versatile for any role" });
    }

    if (data.work_experience.length > 0 && data.education.length > 0 && data.skills.length >= 5) {
      tips.push({ type: "success", message: "Your resume is looking comprehensive!" });
    }

    return tips;
  };

  const tips = generateTips();

  return (
    <Card className="sticky top-24 border border-gray-200 bg-white shadow-lg">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <Lightbulb className="h-4 w-4" />
          </span>
          Real-Time Tips
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3 p-5">
            {tips.map((tip, i) => {
              const isSuccess = tip.type === "success";
              return (
                <div
                  key={i}
                  className={`flex gap-3 rounded-2xl border px-4 py-3 ${
                    isSuccess
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-teal-200 bg-teal-50 text-teal-900"
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                  )}
                  <p className="text-sm">{tip.message}</p>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
