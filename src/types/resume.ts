export type WorkExperience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
};

export type CustomSection = {
  id: string;
  title: string;
  content: string;
};

export type ResumeData = {
  id: string;
  title: string;
  template_type: "professional" | "it" | "marketing" | "design";
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  summary?: string;
  work_experience: WorkExperience[];
  education: Education[];
  skills: string[];
  custom_sections: CustomSection[];
  qr_code_data?: string;
};
