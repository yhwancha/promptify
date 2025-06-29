"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Lightbulb, Calendar, Tag, Search, MessageCircle, Send, Trash2, Plus } from "lucide-react"
import type { SavedIdea, IdeaComment } from "@/types"

export function IdeaBankSidebar() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIdea, setSelectedIdea] = useState<SavedIdea | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)

  const fetchIdeas = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const userSession = localStorage.getItem("userSession")
      if (!userSession) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/ideas?session=${userSession}`)
      if (response.ok) {
        const data = await response.json()
        setIdeas(data)
      }
    } catch (error) {
      console.error("Failed to fetch ideas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addComment = async (ideaId: string) => {
    if (!newComment.trim()) return

    try {
      const userSession = localStorage.getItem("userSession")
      if (!userSession) return

      const response = await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment.trim(),
          user_session: userSession,
        }),
      })

      if (response.ok) {
        setNewComment("")
        await fetchIdeas() // Refresh to get updated comments
        // Update selected idea if it's the one we commented on
        if (selectedIdea?.id === ideaId) {
          const updatedIdea = ideas.find(idea => idea.id === ideaId)
          if (updatedIdea) {
            setSelectedIdea(updatedIdea)
          }
        }
      }
    } catch (error) {
      console.error("Failed to add comment:", error)
    }
  }

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchIdeas() // Refresh to get updated comments
        // Update selected idea
        if (selectedIdea) {
          const updatedIdea = ideas.find(idea => idea.id === selectedIdea.id)
          if (updatedIdea) {
            setSelectedIdea(updatedIdea)
          }
        }
      }
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      fetchIdeas()
    }
  }

  const openCommentDialog = (idea: SavedIdea) => {
    setSelectedIdea(idea)
    setIsCommentDialogOpen(true)
  }

  const closeCommentDialog = () => {
    setIsCommentDialogOpen(false)
    setSelectedIdea(null)
    setNewComment("")
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="shadow-glow hover:shadow-glow transition-all duration-300"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Idea Bank
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[600px] sm:w-[700px] glass-effect border-0">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-xl gradient-text">
              <Lightbulb className="h-5 w-5" />
              Idea Bank
            </SheetTitle>
            <SheetDescription className="text-base">
              Browse your saved ideas and manage comments
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-0 bg-secondary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <ScrollArea className="h-[calc(100vh-240px)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredIdeas.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm ? "No ideas found" : "No ideas yet"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {searchTerm ? "Try a different search term" : "Ideas will appear here when you save them"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredIdeas.map((idea) => (
                    <Card key={idea.id} className="glass-effect border-0 shadow-glow hover:shadow-glow transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base mb-2">
                              {idea.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-3 text-xs">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(idea.created_at)}
                              </span>
                              {idea.category && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  {idea.category}
                                </Badge>
                              )}
                            </CardDescription>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openCommentDialog(idea)}
                            className="h-8 px-2 flex items-center gap-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span className="text-xs">{idea.comments?.length || 0}</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {idea.description}
                          </p>
                          
                          {idea.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {idea.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Comments Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="glass-effect border-0 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments - {selectedIdea?.title}
            </DialogTitle>
            <DialogDescription>
              Manage your thoughts and notes about this idea
            </DialogDescription>
          </DialogHeader>
          
          {selectedIdea && (
            <div className="space-y-4">
              {/* Idea Summary */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedIdea.description}
                </p>
                {selectedIdea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedIdea.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Comments ({selectedIdea.comments?.length || 0})
                </h4>
                
                <ScrollArea className="max-h-60">
                  {selectedIdea.comments && selectedIdea.comments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedIdea.comments.map((comment) => (
                        <div key={comment.id} className="p-3 rounded-lg bg-secondary/30 relative group">
                          <p className="text-sm mb-2">{comment.content}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.created_at)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteComment(comment.id)}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No comments yet</p>
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Add Comment */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Add Comment</h4>
                <div className="flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your thoughts about this idea..."
                    rows={3}
                    className="border-0 bg-secondary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => addComment(selectedIdea.id)}
                    disabled={!newComment.trim()}
                    size="sm"
                    className="shadow-glow hover:shadow-glow transition-all duration-300"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={closeCommentDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 