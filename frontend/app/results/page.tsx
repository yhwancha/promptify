"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Copy, Save, CheckCircle, AlertCircle, Code, Settings, Layers, Cloud, X, Plus, RefreshCw, Lightbulb } from "lucide-react"
import Link from "next/link"
import type { AnalysisResult } from "@/types"
import { ThemeToggle } from "@/components/theme-toggle"
import { HistorySidebar } from "@/components/history-sidebar"
import { IdeaBankSidebar } from "@/components/idea-bank-sidebar"

export default function ResultsPage() {
  const [result, setResult] = useState<(AnalysisResult & { projectIdea: string }) | null>(null)
  const [editedPrompt, setEditedPrompt] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSavingIdea, setIsSavingIdea] = useState(false)
  const [ideaSaved, setIdeaSaved] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState("")
  
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setResult(data)
        setEditedPrompt(data.generatedPrompt)
      } catch (error) {
        console.error("Failed to parse stored result:", error)
        setError("Failed to load stored analysis result.")
      }
    } else {
      router.push("/")
    }
  }, [router])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedPrompt)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error("Copy failed:", error)
      setError("Failed to copy prompt.")
    }
  }

  const savePrompt = async () => {
    if (!result) return

    setIsSaving(true)
    setError("")

    try {
      let userSession = localStorage.getItem("userSession")
      if (!userSession) {
        userSession = "user_" + Math.random().toString(36).substr(2, 9)
        localStorage.setItem("userSession", userSession)
      }

      const promptData = {
        project_idea: result.projectIdea,
        detected_stack: result.detectedStack,
        recommended_tool: result.recommendedTool,
        dev_structure: result.devStructure,
        infra_tools: result.infraTools,
        generated_prompt: result.generatedPrompt,
        final_prompt: editedPrompt,
        is_finalized: true,
        user_session: userSession,
      }

      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptData),
      })

      if (!response.ok) {
        throw new Error("Failed to save prompt. Please try again.")
      }

      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error("Save error:", error)
      setError(error instanceof Error ? error.message : "Failed to save prompt. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const saveIdea = async () => {
    if (!result) return

    setIsSavingIdea(true)
    setError("")

    try {
      let userSession = localStorage.getItem("userSession")
      if (!userSession) {
        userSession = "user_" + Math.random().toString(36).substr(2, 9)
        localStorage.setItem("userSession", userSession)
      }

      const projectIdea = result.projectIdea
      const category = result.detectedStack.frontend.length > 0 ? "Web App" :
        result.detectedStack.database.includes("mobile") ? "Mobile App" : "Application"
      
      const tags = [
        ...result.detectedStack.frontend.slice(0, 2),
        ...result.detectedStack.backend.slice(0, 2),
        result.recommendedTool.name
      ].filter(Boolean)

      const ideaData = {
        title: projectIdea.split('.')[0].substring(0, 100),
        description: projectIdea,
        category: category,
        tags: tags,
        user_session: userSession,
      }

      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ideaData),
      })

      if (!response.ok) {
        throw new Error("Failed to save idea")
      }

      setIdeaSaved(true)
      setTimeout(() => setIdeaSaved(false), 3000)
    } catch (error) {
      console.error("Save idea error:", error)
      setError("Failed to save idea. Please try again.")
    } finally {
      setIsSavingIdea(false)
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 animate-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 animate-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="outline" className="shadow-glow hover:shadow-glow transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <IdeaBankSidebar />
            <HistorySidebar />
            <ThemeToggle />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Analysis Results</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Left Column - Project & Prompt */}
          <div className="space-y-6">
            {/* Project Idea */}
            <Card className="glass-effect border-0 shadow-glow">
              <CardHeader>
                <CardTitle className="text-xl">Your Project Idea</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{result.projectIdea}</p>
              </CardContent>
            </Card>

            {/* Generated Prompt */}
            <Card className="glass-effect border-0 shadow-glow">
              <CardHeader>
                <CardTitle className="text-xl">Generated Prompt</CardTitle>
                <CardDescription className="text-base">Edit this prompt to better match your needs, then save or copy it.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  rows={12}
                  className="resize-none border-0 bg-secondary/50 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-primary/20"
                />
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={copyToClipboard} 
                    variant="outline"
                    className="shadow-glow hover:shadow-glow transition-all duration-300"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copySuccess ? "Copied!" : "Copy Prompt"}
                  </Button>
                  
                  <Button 
                    onClick={saveIdea}
                    disabled={isSavingIdea}
                    variant="outline"
                    className="shadow-glow hover:shadow-glow transition-all duration-300"
                  >
                    {isSavingIdea ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : ideaSaved ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Save Idea
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={savePrompt}
                    disabled={isSaving}
                    className="shadow-glow hover:shadow-glow transition-all duration-300"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : isSaved ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Prompt
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analysis Details */}
          <div className="space-y-6">
            {/* Recommended Tool */}
            <Card className="glass-effect border-0 shadow-glow">
              <CardHeader>
                <CardTitle>Recommended Tool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{result.recommendedTool.name}</h3>
                  <p className="text-muted-foreground mb-3">{result.recommendedTool.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Best for:</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.recommendedTool.bestFor.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Reasoning */}
            <Card className="glass-effect border-0 shadow-glow">
              <CardHeader>
                <CardTitle>AI Reasoning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.recommendedTool.promptStyle}
                </p>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="glass-effect border-0 shadow-glow">
              <CardHeader>
                <CardTitle>Detected Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="frontend" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="frontend">Frontend</TabsTrigger>
                    <TabsTrigger value="backend">Backend</TabsTrigger>
                    <TabsTrigger value="database">Database</TabsTrigger>
                    <TabsTrigger value="additional">Additional</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="frontend" className="space-y-3">
                    <h4 className="font-medium mb-2">Frontend</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedStack.frontend.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="backend" className="space-y-3">
                    <h4 className="font-medium mb-2">Backend</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedStack.backend.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="database" className="space-y-3">
                    <h4 className="font-medium mb-2">Database</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedStack.database.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="additional" className="space-y-3">
                    <h4 className="font-medium mb-2">Additional</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedStack.additional.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Development Structure */}
            <Card className="glass-effect border-0 shadow-glow">
              <CardHeader>
                <CardTitle>Development Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">{result.devStructure.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{result.devStructure.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-green-600">Pros</h4>
                      <ul className="space-y-1">
                        {result.devStructure.pros.map((pro, index) => (
                          <li key={index} className="text-xs text-muted-foreground">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-orange-600">Cons</h4>
                      <ul className="space-y-1">
                        {result.devStructure.cons.map((con, index) => (
                          <li key={index} className="text-xs text-muted-foreground">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Tools */}
            <Card className="glass-effect border-0 shadow-glow">
              <CardHeader>
                <CardTitle>Infrastructure Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="containerization" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="containerization">Container</TabsTrigger>
                    <TabsTrigger value="cicd">CI/CD</TabsTrigger>
                    <TabsTrigger value="hosting">Hosting</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="containerization" className="space-y-3">
                    <h4 className="font-medium mb-2">Containerization</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.infraTools.containerization.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cicd" className="space-y-3">
                    <h4 className="font-medium mb-2">CI/CD</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.infraTools.cicd.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hosting" className="space-y-3">
                    <h4 className="font-medium mb-2">Hosting</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.infraTools.hosting.map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
