"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lightbulb, Code, Zap, AlertCircle, Sparkles, Rocket, Brain } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { HistorySidebar } from "@/components/history-sidebar"
import { IdeaBankSidebar } from "@/components/idea-bank-sidebar"

export default function HomePage() {
  const [projectIdea, setProjectIdea] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAnalyze = async () => {
    if (!projectIdea.trim()) return

    setIsAnalyzing(true)
    setError("")

    try {
      console.log("Sending request to analyze API...")

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectIdea: projectIdea.trim(),
          language: "en",
        }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log("Analysis result:", result)

      // Store in sessionStorage for the results page
      sessionStorage.setItem(
        "analysisResult",
        JSON.stringify({
          projectIdea: projectIdea.trim(),
          ...result,
        }),
      )

      router.push("/results")
    } catch (error) {
      console.error("Analysis error:", error)
      setError(error instanceof Error ? error.message : "Failed to analyze project. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 animate-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">Promptify</span>
          </div>
          <div className="flex items-center gap-3">
            <IdeaBankSidebar />
            <HistorySidebar />
            <ThemeToggle />
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-6 tracking-tight">AI Prompt Generator</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your project ideas into ready-to-use prompts for AI coding tools like v0.dev, Cursor.ai, and GPT Engineer
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-12 shadow-glow glass-effect border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                Describe Your Project Idea
              </CardTitle>
              <CardDescription className="text-base">
                Tell us about your project in natural language. Be as detailed or as brief as you like.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Example: I want to build a task management app with real-time collaboration, user authentication, drag-and-drop functionality, and mobile responsiveness. Users should be able to create projects, assign tasks, set deadlines, and receive notifications."
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                rows={6}
                className="resize-none border-0 bg-secondary/50 text-base leading-relaxed focus:ring-2 focus:ring-primary/20"
              />

              {error && (
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center pt-2">
                <div className="text-sm text-muted-foreground">
                  {projectIdea.length} characters
                </div>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!projectIdea.trim() || isAnalyzing} 
                  size="lg"
                  className="px-8 py-3 text-base font-medium shadow-glow hover:shadow-glow transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-5 w-5" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="glass-effect border-0 shadow-glow hover:shadow-glow transition-all duration-300 group">
              <CardContent className="pt-8 pb-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Smart Analysis</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI analyzes your idea to recommend the perfect tech stack and development approach
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-glow hover:shadow-glow transition-all duration-300 group">
              <CardContent className="pt-8 pb-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Tool Matching</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get recommendations for the best AI coding tool based on your project requirements
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-0 shadow-glow hover:shadow-glow transition-all duration-300 group">
              <CardContent className="pt-8 pb-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Custom Prompts</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Generate tailored prompts optimized for each AI tool's specific style and capabilities
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Save your ideas in the Idea Bank and view generated prompts in Prompt History above.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
