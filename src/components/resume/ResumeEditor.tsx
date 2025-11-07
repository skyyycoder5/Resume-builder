import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import type { CustomSection, Education, ResumeData, WorkExperience } from "@/types/resume";

type Props = {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
};

export const ResumeEditor = ({ data, onChange }: Props) => {
  // --- Helpers ---------------------------------------------------------------
  const normalizeSkills = (value: string | string[]) =>
    Array.isArray(value)
      ? value.filter(Boolean)
      : (value || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

  const updateField = (field: keyof ResumeData, value: any) => {
    if (field === "skills") {
      onChange({ ...data, skills: normalizeSkills(value) });
      return;
    }
    onChange({ ...data, [field]: value });
  };

  // --- Local state for skills input (smooth typing, live preview) ------------
  const [skillsInput, setSkillsInput] = useState(
    Array.isArray(data.skills) ? data.skills.join(", ") : ""
  );

  useEffect(() => {
    setSkillsInput(Array.isArray(data.skills) ? data.skills.join(", ") : "");
  }, [data.skills]);

  // --- Work Experience CRUD --------------------------------------------------
  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    updateField("work_experience", [...data.work_experience, newExp]);
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    const updated = data.work_experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateField("work_experience", updated);
  };

  const removeWorkExperience = (id: string) => {
    updateField(
      "work_experience",
      data.work_experience.filter((exp) => exp.id !== id)
    );
  };

  // --- Education CRUD --------------------------------------------------------
  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
    };
    updateField("education", [...data.education, newEdu]);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updated = data.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateField("education", updated);
  };

  const removeEducation = (id: string) => {
    updateField(
      "education",
      data.education.filter((edu) => edu.id !== id)
    );
  };

  // --- Custom Section CRUD ---------------------------------------------------
  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: crypto.randomUUID(),
      title: "Custom Section",
      content: "",
    };
    updateField("custom_sections", [...data.custom_sections, newSection]);
  };

  const updateCustomSection = (id: string, field: keyof CustomSection, value: any) => {
    const updated = data.custom_sections.map((section) =>
      section.id === id ? { ...section, [field]: value } : section
    );
    updateField("custom_sections", updated);
  };

  const removeCustomSection = (id: string) => {
    updateField(
      "custom_sections",
      data.custom_sections.filter((section) => section.id !== id)
    );
  };

  // --- UI --------------------------------------------------------------------
  return (
    <Card className="border border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70">
      <CardHeader className="border-b border-gray-200/70 pb-4 dark:border-gray-800/70">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Edit Resume
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 md:p-6">
            {/* IMPORTANT: disable Tabs' keyboard trap to allow comma typing */}
            <Tabs defaultValue="basic" className="w-full" data-orientation="vertical">
              <TabsList className="grid w-full grid-cols-4 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                <TabsTrigger
                  value="basic"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
                >
                  Basic
                </TabsTrigger>
                <TabsTrigger
                  value="experience"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
                >
                  Experience
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
                >
                  Custom
                </TabsTrigger>
              </TabsList>

              {/* BASIC */}
              <TabsContent value="basic" className="mt-4 space-y-5">
                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-200">Resume Title</Label>
                  <Input
                    className="h-11 border-gray-300 dark:border-gray-700"
                    value={data.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="My Resume"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-200">Template</Label>
                  <Select
                    value={data.template_type}
                    onValueChange={(value) => updateField("template_type", value)}
                  >
                    <SelectTrigger className="h-11 border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="it">IT / Tech</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="design">Design / Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-200">Full Name</Label>
                  <Input
                    className="h-11 border-gray-300 dark:border-gray-700"
                    value={data.full_name || ""}
                    onChange={(e) => updateField("full_name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-gray-800 dark:text-gray-200">Email</Label>
                    <Input
                      type="email"
                      className="h-11 border-gray-300 dark:border-gray-700"
                      value={data.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-800 dark:text-gray-200">Phone</Label>
                    <Input
                      className="h-11 border-gray-300 dark:border-gray-700"
                      value={data.phone || ""}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-200">Location</Label>
                  <Input
                    className="h-11 border-gray-300 dark:border-gray-700"
                    value={data.location || ""}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="New York, NY"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-gray-800 dark:text-gray-200">LinkedIn URL</Label>
                    <Input
                      className="h-11 border-gray-300 dark:border-gray-700"
                      value={data.linkedin_url || ""}
                      onChange={(e) => updateField("linkedin_url", e.target.value)}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-800 dark:text-gray-200">Portfolio URL</Label>
                    <Input
                      className="h-11 border-gray-300 dark:border-gray-700"
                      value={data.portfolio_url || ""}
                      onChange={(e) => updateField("portfolio_url", e.target.value)}
                      placeholder="johndoe.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-200">Professional Summary</Label>
                  <Textarea
                    className="border-gray-300 dark:border-gray-700"
                    value={data.summary || ""}
                    onChange={(e) => updateField("summary", e.target.value)}
                    placeholder="Brief overview of your professional background..."
                    rows={5}
                  />
                </div>

                {/* SKILLS */}
                <div className="space-y-2">
                  <Label className="text-gray-800 dark:text-gray-200">Skills (comma-separated)</Label>
                  <Textarea
                    className="border-gray-300 dark:border-gray-700 min-h-[80px] resize-none"
                    value={skillsInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSkillsInput(val);
                      updateField("skills", val);
                    }}
                    placeholder="JavaScript, React, Node.js, etc."
                  />
                </div>
              </TabsContent>

              {/* EXPERIENCE */}
              <TabsContent value="experience" className="mt-4 space-y-5">
                <Button onClick={addWorkExperience} className="h-11 w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Work Experience
                </Button>

                {data.work_experience.map((exp) => (
                  <Card
                    key={exp.id}
                    className="space-y-3 border border-gray-200 bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Work Experience</h4>
                      <Button variant="ghost" size="icon" onClick={() => removeWorkExperience(exp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Input
                      className="h-11 border-gray-300 dark:border-gray-700"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(exp.id, "company", e.target.value)}
                    />
                    <Input
                      className="h-11 border-gray-300 dark:border-gray-700"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => updateWorkExperience(exp.id, "position", e.target.value)}
                    />

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <Input
                        type="month"
                        className="h-11 border-gray-300 dark:border-gray-700"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(exp.id, "startDate", e.target.value)}
                      />
                      <Input
                        type="month"
                        className="h-11 border-gray-300 dark:border-gray-700"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateWorkExperience(exp.id, "endDate", e.target.value)}
                        disabled={exp.current}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onCheckedChange={(checked) =>
                          updateWorkExperience(exp.id, "current", Boolean(checked))
                        }
                      />
                      <Label
                        htmlFor={`current-${exp.id}`}
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        Currently working here
                      </Label>
                    </div>

                    <Textarea
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Job description and achievements..."
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(exp.id, "description", e.target.value)}
                      rows={4}
                    />
                  </Card>
                ))}
              </TabsContent>

              {/* EDUCATION */}
              <TabsContent value="education" className="mt-4 space-y-5">
                <Button onClick={addEducation} className="h-11 w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>

                {data.education.map((edu) => (
                  <Card
                    key={edu.id}
                    className="space-y-3 border border-gray-200 bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">Education</h4>
                      <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Input
                      className="h-11 border-gray-300 dark:border-gray-700"
                      placeholder="Institution Name"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    />
                    <Input
                      className="h-11 border-gray-300 dark:border-gray-700"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    />
                    <Input
                      className="h-11 border-gray-300 dark:border-gray-700"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    />

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <Input
                        type="month"
                        className="h-11 border-gray-300 dark:border-gray-700"
                        placeholder="Start Date"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                      />
                      <Input
                        type="month"
                        className="h-11 border-gray-300 dark:border-gray-700"
                        placeholder="End Date"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                        disabled={edu.current}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`current-edu-${edu.id}`}
                        checked={edu.current}
                        onCheckedChange={(checked) =>
                          updateEducation(edu.id, "current", Boolean(checked))
                        }
                      />
                      <Label
                        htmlFor={`current-edu-${edu.id}`}
                        className="text-sm text-gray-700 dark:text-gray-300"
                      >
                        Currently studying
                      </Label>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* CUSTOM */}
              <TabsContent value="custom" className="mt-4 space-y-5">
                <Button onClick={addCustomSection} className="h-11 w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Section
                </Button>

                {data.custom_sections.map((section) => (
                  <Card
                    key={section.id}
                    className="space-y-3 border border-gray-200 bg-white/80 p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
                  >
                    <div className="flex items-start justify-between">
                      <Input
                        className="h-11 border-gray-300 font-semibold dark:border-gray-700"
                        placeholder="Section Title"
                        value={section.title}
                        onChange={(e) => updateCustomSection(section.id, "title", e.target.value)}
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeCustomSection(section.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Textarea
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Section content..."
                      value={section.content}
                      onChange={(e) => updateCustomSection(section.id, "content", e.target.value)}
                      rows={5}
                    />
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
