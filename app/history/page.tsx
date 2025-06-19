"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Calendar } from "lucide-react"
import Link from "next/link"
import type { SavedPrompt } from "@/types"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function HistoryPage() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userSession = localStorage.getItem("userSession")
        if (!userSession) {
          setIsLoading(false)
          return
        }

        const response = await fetch(`/api/prompts?session=${userSession}`)
        if (response.ok) {
          const data = await response.json()
          setPrompts(data)
        }
      } catch (error) {
        console.error("Failed to fetch history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const copyPrompt = async (prompt: string) => {
    await navigator.clipboard.writeText(prompt)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{t.loading}</p>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900">{t.projectHistory}</h1>
          <p className="text-gray-600 mt-2">{t.projectHistoryDesc}</p>
        </div>

        {prompts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noProjects}</h3>
              <p className="text-gray-600 mb-4">{t.noProjectsDesc}</p>
              <Link href="/">
                <Button>{t.createFirstPrompt}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {prompts.map((prompt) => (
              <Card key={prompt.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {prompt.project_idea.substring(0, 100)}
                        {prompt.project_idea.length > 100 && "..."}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {t.createdOn} {formatDate(prompt.created_at)}
                        </span>
                        <Badge variant="outline">{prompt.recommended_tool}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">{t.techStack}</h4>
                      <div className="flex flex-wrap gap-1">
                        {[
                          ...prompt.detected_stack.frontend,
                          ...prompt.detected_stack.backend,
                          ...prompt.detected_stack.database,
                        ].map((tech, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">{t.generatedPrompt}</h4>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="text-sm text-gray-700 font-mono">
                          {(prompt.final_prompt || prompt.generated_prompt).substring(0, 200)}...
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyPrompt(prompt.final_prompt || prompt.generated_prompt)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {t.copyPrompt}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
