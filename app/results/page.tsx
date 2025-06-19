"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Copy, Save, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { AnalysisResult } from "@/types"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function ResultsPage() {
  const [result, setResult] = useState<(AnalysisResult & { projectIdea: string }) | null>(null)
  const [editedPrompt, setEditedPrompt] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisResult")
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setResult(data)
        setEditedPrompt(data.generatedPrompt)
      } catch (error) {
        console.error("Failed to parse stored result:", error)
        setError(t.errorLoading)
      }
    } else {
      router.push("/")
    }
  }, [router, t.errorLoading])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedPrompt)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error("Copy failed:", error)
      setError(t.errorCopying)
    }
  }

  const savePrompt = async () => {
    if (!result) return

    setIsSaving(true)
    setError("")

    try {
      // Generate a simple session ID if not exists
      let userSession = localStorage.getItem("userSession")
      if (!userSession) {
        userSession = "user_" + Math.random().toString(36).substr(2, 9)
        localStorage.setItem("userSession", userSession)
      }

      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectIdea: result.projectIdea,
          detectedStack: result.detectedStack,
          recommendedTool: result.recommendedTool,
          generatedPrompt: result.generatedPrompt,
          finalPrompt: editedPrompt,
          isFinalized: true,
          userSession,
        }),
      })

      if (!response.ok) {
        throw new Error(t.errorSaving)
      }

      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      console.error("Save error:", error)
      setError(t.errorSaving)
    } finally {
      setIsSaving(false)
    }
  }

  if (!result && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error && !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Link href="/">
              <Button>{t.backToHome}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToHome}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t.analysisResults}</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.projectIdea}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{result?.projectIdea}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.generatedPrompt}</CardTitle>
                <CardDescription>{t.generatedPromptDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    {copySuccess ? t.copied : t.copyPrompt}
                  </Button>
                  <Button onClick={savePrompt} disabled={isSaving}>
                    {isSaving ? (
                      t.saving
                    ) : isSaved ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t.saved}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t.savePrompt}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.recommendedTool}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {result?.recommendedTool.name}
                  </Badge>
                  <p className="text-sm text-gray-600">{result?.recommendedTool.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">{t.bestFor}</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result?.recommendedTool.bestFor.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.detectedTechStack}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">{t.frontend}</h4>
                  <div className="flex flex-wrap gap-1">
                    {result?.detectedStack.frontend.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">{t.backend}</h4>
                  <div className="flex flex-wrap gap-1">
                    {result?.detectedStack.backend.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">{t.database}</h4>
                  <div className="flex flex-wrap gap-1">
                    {result?.detectedStack.database.map((tech, index) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {result?.detectedStack.additional && result.detectedStack.additional.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">{t.additional}</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.detectedStack.additional.map((tech, index) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.aiReasoning}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{result?.reasoning}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
