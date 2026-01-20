"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Building2, Users, Briefcase, TrendingUp } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">ATS System</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button onClick={() => router.push("/signup")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Streamline Your Recruitment Process
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Enterprise-grade Applicant Tracking System for modern recruitment agencies.
          Manage candidates, interviews, and offers all in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => router.push("/signup")}>
            Start
          </Button>
          <Button size="lg" variant="outline" onClick={() => router.push("/login")}>
            Sign In
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Hire Better
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg bg-white">
            <Users className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Candidate Management</h3>
            <p className="text-muted-foreground">
              Track candidates through every stage of your hiring pipeline with ease.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-white">
            <Briefcase className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interview Scheduling</h3>
            <p className="text-muted-foreground">
              Schedule and manage multi-level interviews with built-in decision workflows.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-white">
            <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Offer Management</h3>
            <p className="text-muted-foreground">
              Create offers, track acceptance, and manage joining workflows seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 ATS System. Enterprise Recruitment Management.</p>
        </div>
      </footer>
    </div>
  );
}
