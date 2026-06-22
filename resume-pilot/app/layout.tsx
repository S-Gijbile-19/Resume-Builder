import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumePilot – Build Better Resumes. Get ATS Insights.",
  description:
    "ResumePilot helps students and job seekers create professional resumes, evaluate ATS compatibility, and improve resume quality with actionable insights.",
  keywords: [
    "resume builder",
    "ATS checker",
    "resume template",
    "job search",
    "professional resume",
    "ResumePilot",
  ],
  authors: [{ name: "Shruti Suryakant Gijbile" }],
  openGraph: {
    title: "ResumePilot – Build Better Resumes. Get ATS Insights.",
    description:
      "Create professional resumes and get instant ATS compatibility scores.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
