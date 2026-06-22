import { ATSResult, ResumeData, AdvancedAnalysisResult, SectionScore } from "@/types/resume";

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
  let total = 11; // Base fields for Resume: fullName, email, phone, linkedin, address, summary, education, skills, projects, experience, certifications

  if (data.fullName.trim()) filled++;
  if (data.email.trim()) filled++;
  if (data.phone.trim()) filled++;
  if (data.linkedin.trim()) filled++;
  if (data.address.trim()) filled++;
  if (data.summary.trim()) filled++;
  if (data.education.length > 0 && data.education[0].institution.trim()) filled++;
  if (data.skills.trim()) filled++;
  if (data.projects.length > 0 && data.projects[0].name.trim()) filled++;
  if (data.experience.length > 0 && data.experience[0].company.trim()) filled++;
  if (data.certifications.trim()) filled++;

  if (data.documentType === "cv") {
    total += 3; // achievements, languages, publications/additionalDetails
    if (data.achievements.trim()) filled++;
    if (data.languages.trim()) filled++;
    if ((data.publications && data.publications.trim()) || (data.additionalDetails && data.additionalDetails.trim())) {
      filled++;
    }
  }

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
  if (!data.address.trim()) missing.push("Address");
  if (!data.summary.trim()) missing.push("Professional Summary");
  if (!data.education.length || !data.education[0].institution.trim()) missing.push("Education");
  if (!data.skills.trim()) missing.push("Skills");
  if (!data.projects.length || !data.projects[0].name.trim()) missing.push("Projects");
  if (!data.experience.length || !data.experience[0].company.trim()) missing.push("Experience");
  if (!data.certifications.trim()) missing.push("Certifications");

  if (data.documentType === "cv") {
    if (!data.achievements.trim()) missing.push("Achievements");
    if (!data.languages.trim()) missing.push("Languages");
  }
  return missing;
}

export function resumeDataToText(data: ResumeData): string {
  const lines: string[] = [];
  lines.push(data.fullName);
  lines.push(`Email: ${data.email} | Phone: ${data.phone} | LinkedIn: ${data.linkedin}`);
  if (data.address) lines.push(`Address: ${data.address}`);
  if (data.summary) lines.push(`\nSummary\n${data.summary}`);
  
  if (data.education.length && data.education[0].institution) {
    lines.push("\nEducation");
    data.education.forEach((e) => {
      lines.push(`${e.degree} in ${e.field} – ${e.institution} (${e.startYear}–${e.endYear})`);
      if (e.gpa) lines.push(`GPA: ${e.gpa}`);
    });
  }
  if (data.skills) lines.push(`\nSkills\n${data.skills}`);
  
  if (data.experience.length && data.experience[0].company) {
    lines.push("\nExperience");
    data.experience.forEach((ex) => {
      lines.push(`${ex.role} at ${ex.company} (${ex.startDate} – ${ex.current ? "Present" : ex.endDate})`);
      lines.push(ex.description);
    });
  }
  if (data.projects.length && data.projects[0].name) {
    lines.push("\nProjects");
    data.projects.forEach((p) => {
      lines.push(`${p.name} – ${p.technologies}`);
      lines.push(p.description);
    });
  }
  if (data.certifications) lines.push(`\nCertifications\n${data.certifications}`);
  if (data.achievements) lines.push(`\nAchievements\n${data.achievements}`);
  if (data.languages) lines.push(`\nLanguages\n${data.languages}`);
  if (data.publications) lines.push(`\nPublications\n${data.publications}`);
  if (data.additionalDetails) lines.push(`\nAdditional Details\n${data.additionalDetails}`);
  
  return lines.join("\n");
}

export function analyzeResumeText(text: string): AdvancedAnalysisResult {
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missingSections: string[] = [];
  const recommendations: string[] = [];

  // Action Verbs
  const actionVerbs = ["led", "managed", "developed", "built", "designed", "created", "implemented", "optimized", "increased", "decreased", "reduced", "improved", "automated", "solved", "analyzed", "collaborated", "spearheaded", "generated", "delivered", "coordinated", "executed", "formulated"];
  const verbMatches = actionVerbs.filter(verb => new RegExp(`\\b${verb}\\b`, "i").test(text));

  // Measurable achievements (numbers, percentages, currencies)
  const numbersFound = (text.match(/\b\d+(?:\.\d+)?%?\b/g) || []).filter(n => {
    // filter out typical years like 2020, 2024, or standard phone digits
    const val = parseInt(n, 10);
    return (n.includes("%") || (val > 0 && val < 1900) || val > 2100);
  });
  const hasMetrics = numbersFound.length >= 3 || text.includes("%") || /\$\d+/g.test(text);

  // Common Keywords
  const standardKeywords = ["javascript", "typescript", "python", "java", "react", "node", "sql", "aws", "git", "docker", "agile", "scrum", "analytics", "database", "api", "communication", "leadership", "management"];
  const matchedKeywords = standardKeywords.filter(k => lower.includes(k));

  // Section Checks
  const hasContact = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text) && /(\+?\d[\s\-.]?){7,15}/.test(text);
  const hasSummary = /summary|profile|objective|about me/i.test(text) || (wordCount > 50 && lower.substring(0, 300).includes("seeking") || lower.substring(0, 300).includes("passionate"));
  const hasEducation = /education|university|college|degree|bachelor|master|b\.tech|b\.sc|m\.tech|mba|graduate/i.test(text);
  const hasSkills = /skills|technologies|tools|expertise/i.test(text);
  const hasExperience = /experience|employment|work history|career|internship/i.test(text);
  const hasProjects = /projects|portfolio|built|developed/i.test(text);
  const hasCertifications = /certifications|certified|credentials/i.test(text);
  const hasAchievements = /achievements|awards|honors|accomplishments/i.test(text);
  const hasLanguages = /languages|bilingual|fluent/i.test(text);

  // Section Scoring
  let contactScore = 0;
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text)) contactScore += 5;
  if (/(\+?\d[\s\-.]?){7,15}/.test(text)) contactScore += 5;
  if (/linkedin\.com\//i.test(text)) contactScore += 5;
  if (/\b(?:street|city|zip|state|country|address|road|drive)\b/i.test(text) || /[A-Z][a-z]+,?\s+[A-Z]{2}\s+\d{5}/.test(text)) contactScore += 5; // Address check

  const summaryScore = hasSummary ? 10 : 0;
  const educationScore = hasEducation ? 15 : 0;
  const skillsScore = hasSkills ? (matchedKeywords.length >= 5 ? 15 : 10) : 0;
  
  let experienceScore = 0;
  if (hasExperience) {
    experienceScore = 10;
    if (verbMatches.length >= 4) experienceScore += 5;
    if (wordCount > 350) experienceScore += 5;
  }

  let projectsScore = 0;
  if (hasProjects) {
    projectsScore = 10;
    if (matchedKeywords.length >= 3) projectsScore += 5;
  }

  const certificationsScore = hasCertifications ? 5 : 0;
  const achievementsScore = hasAchievements ? 5 : 0;

  // Formatting & Length Score
  let formattingScore = 10;
  if (wordCount < 200) formattingScore -= 5;
  if (wordCount > 1000) formattingScore -= 3;
  if (!hasContact) formattingScore -= 2;

  // Compile missing sections
  if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text)) missingSections.push("Email Address");
  if (!/(\+?\d[\s\-.]?){7,15}/.test(text)) missingSections.push("Phone Number");
  if (!/linkedin\.com\//i.test(text)) missingSections.push("LinkedIn Profile");
  if (!hasSummary) missingSections.push("Professional Summary");
  if (!hasEducation) missingSections.push("Education");
  if (!hasSkills) missingSections.push("Skills Section");
  if (!hasExperience) missingSections.push("Work Experience");
  if (!hasProjects) missingSections.push("Projects");
  if (!hasCertifications) missingSections.push("Certifications");
  if (!hasAchievements) missingSections.push("Achievements / Awards");

  // Strengths & Weaknesses
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text) && /linkedin\.com\//i.test(text)) {
    strengths.push("Professional contact info and LinkedIn profile are present.");
  } else {
    weaknesses.push("Missing key contact info or LinkedIn link.");
  }

  if (hasEducation) strengths.push("Education section is clearly defined.");
  else weaknesses.push("Education section is missing or hard to scan.");

  if (hasSkills && matchedKeywords.length >= 6) {
    strengths.push("Excellent keyword presence in your skills section.");
  } else if (!hasSkills) {
    weaknesses.push("Missing a dedicated skills list.");
  } else {
    weaknesses.push("Skills section lacks sufficient industry-relevant keywords.");
  }

  if (hasExperience) {
    if (verbMatches.length >= 5) {
      strengths.push("Strong usage of action-oriented verbs to describe experience.");
    } else {
      weaknesses.push("Experience details feel passive. Add more strong action verbs.");
    }
  } else {
    weaknesses.push("No clear professional experience section found.");
  }

  if (hasMetrics) {
    strengths.push("Quantified achievements present (percentages, dollars, or metrics).");
  } else {
    weaknesses.push("Impact is not quantified. Try adding measurable metrics (%, $, count) to achievements.");
  }

  if (wordCount >= 400 && wordCount <= 800) {
    strengths.push("Perfect resume length (ideal word count for single page).");
  } else if (wordCount < 250) {
    weaknesses.push("Resume is very brief. Expand descriptions to showcase more depth.");
  } else {
    weaknesses.push("Resume is quite wordy. Condense statements to keep it readable.");
  }

  // Recommendations builder
  if (!hasContact) recommendations.push("Provide full contact details: email, phone, and professional profiles.");
  if (!/linkedin\.com\//i.test(text)) recommendations.push("Add a link to your LinkedIn profile to boost your search credibility.");
  if (!hasSummary) recommendations.push("Draft a 2-3 sentence Professional Summary at the top explaining your unique value.");
  if (!hasSkills) recommendations.push("Create a clear Skills section categorized by technical, tools, or soft skills.");
  if (!hasExperience) recommendations.push("Incorporate detailed Work Experience, listing reverse-chronological roles with achievements.");
  if (!hasProjects) recommendations.push("Showcase 2-3 projects mentioning the technologies used and what you implemented.");
  if (verbMatches.length < 5) recommendations.push("Replace weak or passive phrasing with powerful action verbs like 'Spearheaded', 'Optimized', 'Engineered', 'Delivered'.");
  if (!hasMetrics) recommendations.push("Quantify your impact: mention team sizes, percentages of performance increase, or dollars saved.");
  if (matchedKeywords.length < 5) recommendations.push("Improve your keyword coverage. Review target job descriptions and weave in terms like 'TypeScript', 'Docker', 'Agile', etc.");
  if (!hasCertifications) recommendations.push("Include any relevant industry Certifications (e.g., AWS, Scrum Master, Google Certificates) to show continuous learning.");
  if (!hasLanguages) recommendations.push("If you speak multiple languages, list them to stand out for global roles.");

  // Scores calculations
  // ATS Compatibility Score
  const atsScore = Math.round(
    (contactScore / 20) * 15 +
    (educationScore / 15) * 15 +
    (skillsScore / 15) * 15 +
    (experienceScore / 20) * 20 +
    (projectsScore / 15) * 15 +
    (certificationsScore / 5) * 5 +
    (achievementsScore / 5) * 5 +
    (formattingScore / 10) * 10
  );

  // Strength Score
  let strengthScoreVal = 30; // base
  if (hasContact) strengthScoreVal += 10;
  if (hasSummary) strengthScoreVal += 5;
  if (hasEducation) strengthScoreVal += 10;
  if (hasSkills) strengthScoreVal += 10;
  if (hasExperience) strengthScoreVal += 10;
  if (hasProjects) strengthScoreVal += 10;
  if (hasMetrics) strengthScoreVal += 10;
  if (verbMatches.length >= 5) strengthScoreVal += 5;

  const strengthScore = Math.min(100, strengthScoreVal);

  // Completion Percentage
  let detectedSectionsCount = 0;
  const sectionsToCheck = [hasContact, hasSummary, hasEducation, hasSkills, hasExperience, hasProjects, hasCertifications, hasAchievements, hasLanguages];
  sectionsToCheck.forEach(s => { if (s) detectedSectionsCount++; });
  const completionPercentage = Math.round((detectedSectionsCount / sectionsToCheck.length) * 100);

  // Status mappings
  const getStatus = (score: number, max: number): "good" | "warning" | "poor" => {
    const pct = (score / max) * 100;
    if (pct >= 75) return "good";
    if (pct >= 40) return "warning";
    return "poor";
  };

  return {
    strengthScore,
    atsScore,
    completionPercentage,
    strengths,
    weaknesses,
    missingSections,
    recommendations,
    sectionBreakdown: {
      contactInfo: { score: contactScore, maxScore: 20, label: "Contact Information", status: getStatus(contactScore, 20), feedback: hasContact ? "Complete contact info detected." : "Missing phone, email or address." },
      summary: { score: summaryScore, maxScore: 10, label: "Professional Summary", status: getStatus(summaryScore, 10), feedback: hasSummary ? "Summary section found." : "Add a summary to introduce yourself." },
      education: { score: educationScore, maxScore: 15, label: "Education", status: getStatus(educationScore, 15), feedback: hasEducation ? "Academic background listed." : "Add degrees or university details." },
      skills: { score: skillsScore, maxScore: 15, label: "Skills", status: getStatus(skillsScore, 15), feedback: `${matchedKeywords.length} key skill keywords matched.` },
      experience: { score: experienceScore, maxScore: 20, label: "Work Experience", status: getStatus(experienceScore, 20), feedback: `${verbMatches.length} action verbs detected in descriptions.` },
      projects: { score: projectsScore, maxScore: 15, label: "Projects", status: getStatus(projectsScore, 15), feedback: hasProjects ? "Projects section present." : "Include side or academic projects." },
      certifications: { score: certificationsScore, maxScore: 5, label: "Certifications", status: getStatus(certificationsScore, 5), feedback: hasCertifications ? "Certifications listed." : "Add professional credentials." },
      achievements: { score: achievementsScore, maxScore: 5, label: "Achievements", status: getStatus(achievementsScore, 5), feedback: hasAchievements ? "Awards/achievements listed." : "Highlight achievements or honors." },
      formatting: { score: formattingScore, maxScore: 10, label: "Formatting & Length", status: getStatus(formattingScore, 10), feedback: `${wordCount} words detected. Formatting looks solid.` },
    }
  };
}
