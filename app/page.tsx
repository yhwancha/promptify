"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lightbulb, Code, Zap, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function HomePage() {
  const [projectIdea, setProjectIdea] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t, language } = useLanguage()

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
          language: language,
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
      setError(error instanceof Error ? error.message : t.errorAnalyzing)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                {t.describeProject}
              </CardTitle>
              <CardDescription>{t.describeProjectDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t.placeholder}
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                rows={6}
                className="resize-none"
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {projectIdea.length} {t.characters}
                </div>
                <Button onClick={handleAnalyze} disabled={!projectIdea.trim() || isAnalyzing} size="lg">
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.analyzing}
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      {t.generatePrompt}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Code className="h-8 w-8 text-blue-600" />
                  <h3 className="font-semibold">{t.smartAnalysis}</h3>
                </div>
                <p className="text-sm text-gray-600">{t.smartAnalysisDesc}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-8 w-8 text-green-600" />
                  <h3 className="font-semibold">{t.toolMatching}</h3>
                </div>
                <p className="text-sm text-gray-600">{t.toolMatchingDesc}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb className="h-8 w-8 text-purple-600" />
                  <h3 className="font-semibold">{t.customPrompts}</h3>
                </div>
                <p className="text-sm text-gray-600">{t.customPromptsDesc}</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/history">
              <Button variant="outline">{t.projectHistory}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
