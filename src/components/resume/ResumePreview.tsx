import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ResumeData } from "@/types/resume";
import { QRCodeSVG } from "qrcode.react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import type { ResumeData } from "@/types/resume";

type Props = {
  data: ResumeData;
};

export const ResumePreview = ({ data }: Props) => {
  const getTemplateStyles = () => {
    switch (data.template_type) {
      case "it":
        return "bg-gradient-to-br from-blue-50 to-cyan-50";
      case "marketing":
        return "bg-gradient-to-br from-purple-50 to-pink-50";
      case "design":
        return "bg-gradient-to-br from-orange-50 to-yellow-50";
      default:
        return "bg-white";
    }
  };

  const portfolioUrl = data.portfolio_url?.startsWith("http")
    ? data.portfolio_url
    : data.portfolio_url
    ? `https://${data.portfolio_url}`
    : "";

  return (
    <Card className="shadow-strong sticky top-24">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div
            id="resume-preview"
            className={`${getTemplateStyles()} p-8 rounded-lg shadow-inner min-h-[1056px]`}
          >
            {/* Header */}
            <div className="mb-6 pb-4 border-b-2 border-primary/20">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                {data.full_name || "Your Name"}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {data.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{data.phone}</span>
                  </div>
                )}
                {data.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{data.location}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-2">
                {data.linkedin_url && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="w-4 h-4" />
                    <span>{data.linkedin_url}</span>
                  </div>
                )}
                {data.portfolio_url && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{data.portfolio_url}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {data.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2 border-b border-primary/20 pb-1">
                  Professional Summary
                </h2>
                <p className="text-sm text-foreground/80">{data.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {data.work_experience.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-3 border-b border-primary/20 pb-1">
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {data.work_experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">{exp.position}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </p>
                      </div>
                      <p className="text-sm text-foreground/80 whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-3 border-b border-primary/20 pb-1">
                  Education
                </h2>
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {edu.degree} in {edu.field}
                          </h3>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {data.skills && Array.isArray(data.skills) && data.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2 border-b border-primary/20 pb-1">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.skills.filter(skill => skill && skill.trim()).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-200 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Sections */}
            {data.custom_sections.map((section) => (
              <div key={section.id} className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2 border-b border-primary/20 pb-1">
                  {section.title}
                </h2>
                <p className="text-sm text-foreground/80 whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}

            {/* QR Code */}
            {portfolioUrl && (
              <div className="flex justify-center mt-8 pt-4 border-t border-primary/20">
                <div className="text-center">
                  <QRCodeSVG value={portfolioUrl} size={100} />
                  <p className="text-xs text-muted-foreground mt-2">Scan for Portfolio</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
