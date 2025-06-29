"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Calendar } from "lucide-react"
import Link from "next/link"
import type { SavedPrompt } from "@/types"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HistoryPage() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 animate-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 animate-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header Controls */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <ThemeToggle />
        </div>

        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4 hover:bg-secondary/50 transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold gradient-text">Project History</h1>
          <p className="text-muted-foreground mt-2 text-base">View and manage your previously generated prompts</p>
        </div>

        {prompts.length === 0 ? (
          <Card className="glass-effect border-0 shadow-glow">
            <CardContent className="text-center py-16">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-3">No projects yet</h3>
              <p className="text-muted-foreground mb-6 text-base leading-relaxed">Start by creating your first AI prompt from a project idea.</p>
              <Link href="/">
                <Button size="lg" className="px-8 py-3 shadow-glow hover:shadow-glow transition-all duration-300">
                  Create Your First Prompt
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className="glass-effect border-0 shadow-glow hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3">
                        {prompt.project_idea.substring(0, 100)}
                        {prompt.project_idea.length > 100 && "..."}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-base">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Created on {formatDate(prompt.created_at)}
                        </span>
                        <Badge variant="outline" className="px-3 py-1">{prompt.recommended_tool}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Tech Stack</h4>
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

                    {prompt.dev_structure && (
                      <div>
                        <h4 className="font-medium mb-2">Development Structure</h4>
                        <Badge variant="outline" className="text-xs">
                          {prompt.dev_structure.name}
                        </Badge>
                      </div>
                    )}

                    {prompt.infra_tools && (
                      <div>
                        <h4 className="font-medium mb-2">Infrastructure Tools</h4>
                        <div className="flex flex-wrap gap-1">
                          {[
                            ...prompt.infra_tools.containerization,
                            ...prompt.infra_tools.orchestration,
                            ...prompt.infra_tools.hosting,
                          ].slice(0, 6).map((tool, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                          {([
                            ...prompt.infra_tools.containerization,
                            ...prompt.infra_tools.orchestration,
                            ...prompt.infra_tools.hosting,
                          ].length > 6) && (
                            <Badge variant="outline" className="text-xs">
                              +{[
                                ...prompt.infra_tools.containerization,
                                ...prompt.infra_tools.orchestration,
                                ...prompt.infra_tools.hosting,
                              ].length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium mb-2">Generated Prompt</h4>
                      <div className="bg-secondary/50 p-3 rounded-md">
                        <p className="text-sm text-muted-foreground font-mono">
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
                        Copy Prompt
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
