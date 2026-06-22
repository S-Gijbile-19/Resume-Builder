import { ATSResult, ResumeData } from "@/types/resume";

export function calculateATSScore(text: string): ATSResult {
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const suggestions: string[] = [];

  // --- Contact Info ---
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /(\+?\d[\s\-.]?){7,15}/.test(text);
  const hasLinkedIn = /linkedin\.com\//i.test(text);
  let contactScore = 0;
  if (hasEmail) contactScore += 7;
  else suggestions.push("Add a professional email address to your contact information.");
  if (hasPhone) contactScore += 7;
  else suggestions.push("Include a phone number so recruiters can reach you.");
  if (hasLinkedIn) contactScore += 6;
  else suggestions.push("Add your LinkedIn profile URL to boost professional credibility.");
  const contactStatus =
    contactScore >= 18 ? "good" : contactScore >= 10 ? "warning" : "poor";

  // --- Education ---
  const educationKeywords = ["education", "university", "college", "bachelor", "master", "degree", "b.sc", "b.tech", "m.tech", "mba", "b.e", "m.e", "graduate", "diploma", "gpa", "cgpa"];
  const educationMatches = educationKeywords.filter((k) => lower.includes(k)).length;
  let educationScore = Math.min(20, educationMatches * 4);
  const educationStatus =
    educationScore >= 16 ? "good" : educationScore >= 8 ? "warning" : "poor";
  if (educationScore < 8) suggestions.push("Add a clear Education section with your degree, institution and graduation year.");

  // --- Skills ---
  const skillsKeywords = ["skills", "technologies", "tools", "frameworks", "languages", "proficient", "expertise"];
  const skillsMatch = skillsKeywords.filter((k) => lower.includes(k)).length;
  const techTerms = ["javascript", "python", "java", "react", "node", "sql", "html", "css", "aws", "git", "typescript", "c++", "c#", "figma", "excel"];
  const techMatch = techTerms.filter((k) => lower.includes(k)).length;
  let skillsScore = Math.min(20, skillsMatch * 4 + techMatch * 2);
  const skillsStatus =
    skillsScore >= 16 ? "good" : skillsScore >= 8 ? "warning" : "poor";
  if (skillsScore < 8) suggestions.push("Include a dedicated Skills section listing relevant technical and soft skills.");

  // --- Experience ---
  const experienceKeywords = ["experience", "worked", "employment", "intern", "internship", "position", "role", "company", "organization", "responsibilities", "achieved", "led", "managed", "developed", "built", "improved"];
  const experienceMatches = experienceKeywords.filter((k) => lower.includes(k)).length;
  let experienceScore = Math.min(20, experienceMatches * 2);
  const experienceStatus =
    experienceScore >= 16 ? "good" : experienceScore >= 8 ? "warning" : "poor";
  if (experienceScore < 8) suggestions.push("Add work or internship experience with clear descriptions of your contributions.");

  // --- Projects ---
  const projectKeywords = ["project", "built", "developed", "created", "implemented", "deployed", "application", "system", "platform", "tool", "website", "app"];
  const projectMatches = projectKeywords.filter((k) => lower.includes(k)).length;
  let projectScore = Math.min(15, projectMatches * 2);
  const projectStatus =
    projectScore >= 12 ? "good" : projectScore >= 6 ? "warning" : "poor";
  if (projectScore < 6) suggestions.push("Showcase relevant projects with descriptions and technologies used.");

  // --- Resume Length ---
  let lengthScore = 0;
  let lengthFeedback = "";
  if (wordCount < 100) {
    lengthScore = 2;
    lengthFeedback = "Very short – add more detail to each section.";
    suggestions.push("Your resume is too short. Aim for 400–700 words for a strong single-page resume.");
  } else if (wordCount < 300) {
    lengthScore = 3;
    lengthFeedback = "Below recommended length. Expand your sections.";
    suggestions.push("Expand your resume content. Describe your experiences and projects in more detail.");
  } else if (wordCount <= 700) {
    lengthScore = 5;
    lengthFeedback = "Ideal length for a single-page resume.";
  } else if (wordCount <= 1000) {
    lengthScore = 4;
    lengthFeedback = "Slightly long – consider trimming to one page.";
    suggestions.push("Consider condensing your resume to a single page for most positions.");
  } else {
    lengthScore = 3;
    lengthFeedback = "Too long – ATS systems may have trouble parsing lengthy resumes.";
    suggestions.push("Your resume is too long. Keep it to one or two pages maximum.");
  }
  const lengthStatus =
    lengthScore >= 5 ? "good" : lengthScore >= 3 ? "warning" : "poor";

  const totalScore =
    contactScore + educationScore + skillsScore + experienceScore + projectScore + lengthScore;

  return {
    totalScore,
    sections: {
      contactInfo: { score: contactScore, maxScore: 20, label: "Contact Information", status: contactStatus, feedback: `Email, phone, and LinkedIn detected.` },
      education: { score: educationScore, maxScore: 20, label: "Education", status: educationStatus, feedback: educationMatches > 2 ? "Education section found with relevant details." : "Limited education keywords detected." },
      skills: { score: skillsScore, maxScore: 20, label: "Skills", status: skillsStatus, feedback: techMatch > 3 ? "Strong technical skills presence." : "Add more specific technical skills." },
      experience: { score: experienceScore, maxScore: 20, label: "Experience", status: experienceStatus, feedback: experienceMatches > 4 ? "Good experience section with action verbs." : "Use more action verbs to describe your experience." },
      projects: { score: projectScore, maxScore: 15, label: "Projects", status: projectStatus, feedback: projectMatches > 3 ? "Projects section detected." : "Add more project details." },
      resumeLength: { score: lengthScore, maxScore: 5, label: "Resume Length", status: lengthStatus, feedback: `${wordCount} words – ${lengthFeedback}` },
    },
    suggestions,
  };
}

export function calculateCompletion(data: ResumeData): number {
  let filled = 0;
  const total = 9;
  if (data.fullName.trim()) filled++;
  if (data.email.trim()) filled++;
  if (data.phone.trim()) filled++;
  if (data.linkedin.trim()) filled++;
  if (data.education.length > 0 && data.education[0].institution.trim()) filled++;
  if (data.skills.trim()) filled++;
  if (data.projects.length > 0 && data.projects[0].name.trim()) filled++;
  if (data.experience.length > 0 && data.experience[0].company.trim()) filled++;
  if (data.certifications.trim()) filled++;
  return Math.round((filled / total) * 100);
}

export function getResumeStrength(score: number, completion: number): "Weak" | "Good" | "Strong" {
  const combined = (score + completion) / 2;
  if (combined >= 75) return "Strong";
  if (combined >= 45) return "Good";
  return "Weak";
}

export function getMissingSections(data: ResumeData): string[] {
  const missing: string[] = [];
  if (!data.fullName.trim()) missing.push("Full Name");
  if (!data.email.trim()) missing.push("Email");
  if (!data.phone.trim()) missing.push("Phone");
  if (!data.linkedin.trim()) missing.push("LinkedIn");
  if (!data.education.length || !data.education[0].institution.trim()) missing.push("Education");
  if (!data.skills.trim()) missing.push("Skills");
  if (!data.projects.length || !data.projects[0].name.trim()) missing.push("Projects");
  if (!data.experience.length || !data.experience[0].company.trim()) missing.push("Experience");
  if (!data.certifications.trim()) missing.push("Certifications");
  return missing;
}

export function resumeDataToText(data: ResumeData): string {
  const lines: string[] = [];
  lines.push(data.fullName);
  lines.push(`Email: ${data.email} | Phone: ${data.phone} | LinkedIn: ${data.linkedin}`);
  if (data.summary) lines.push(`\nSummary\n${data.summary}`);
  if (data.education.length) {
    lines.push("\nEducation");
    data.education.forEach((e) => {
      lines.push(`${e.degree} in ${e.field} – ${e.institution} (${e.startYear}–${e.endYear})`);
      if (e.gpa) lines.push(`GPA: ${e.gpa}`);
    });
  }
  if (data.skills) lines.push(`\nSkills\n${data.skills}`);
  if (data.experience.length) {
    lines.push("\nExperience");
    data.experience.forEach((ex) => {
      lines.push(`${ex.role} at ${ex.company} (${ex.startDate} – ${ex.current ? "Present" : ex.endDate})`);
      lines.push(ex.description);
    });
  }
  if (data.projects.length) {
    lines.push("\nProjects");
    data.projects.forEach((p) => {
      lines.push(`${p.name} – ${p.technologies}`);
      lines.push(p.description);
    });
  }
  if (data.certifications) lines.push(`\nCertifications\n${data.certifications}`);
  return lines.join("\n");
}
