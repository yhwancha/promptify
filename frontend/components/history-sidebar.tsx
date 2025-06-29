"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Copy, Calendar, X } from "lucide-react"
import type { SavedPrompt } from "@/types"

export function HistorySidebar() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchHistory = async () => {
    if (isLoading) return
    
    setIsLoading(true)
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

  const copyPrompt = async (prompt: string) => {
    await navigator.clipboard.writeText(prompt)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      fetchHistory()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="shadow-glow hover:shadow-glow transition-all duration-300"
        >
          <History className="mr-2 h-4 w-4" />
          Project History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[700px] glass-effect border-0">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl gradient-text">
            <History className="h-5 w-5" />
            Project History
          </SheetTitle>
          <SheetDescription className="text-base">
            View and manage your previously generated prompts
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-sm">Start by creating your first AI prompt from a project idea.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className="glass-effect border-0 shadow-glow hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base mb-2 line-clamp-2">
                          {prompt.project_idea}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(prompt.created_at)}
                          </span>
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {prompt.recommended_tool}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Tech Stack</h4>
                        <div className="flex flex-wrap gap-1">
                          {[
                            ...prompt.detected_stack.frontend,
                            ...prompt.detected_stack.backend,
                            ...prompt.detected_stack.database,
                          ].slice(0, 4).map((tech, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                              {tech}
                            </Badge>
                          ))}
                          {([
                            ...prompt.detected_stack.frontend,
                            ...prompt.detected_stack.backend,
                            ...prompt.detected_stack.database,
                          ].length > 4) && (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                              +{[
                                ...prompt.detected_stack.frontend,
                                ...prompt.detected_stack.backend,
                                ...prompt.detected_stack.database,
                              ].length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {prompt.dev_structure && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">Development Structure</h4>
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            {prompt.dev_structure.name}
                          </Badge>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-sm mb-1">Generated Prompt</h4>
                        <div className="bg-secondary/50 p-2 rounded-md">
                          <p className="text-xs text-muted-foreground font-mono line-clamp-3">
                            {(prompt.final_prompt || prompt.generated_prompt).substring(0, 150)}...
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyPrompt(prompt.final_prompt || prompt.generated_prompt)}
                        className="w-full text-xs"
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copy Prompt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 