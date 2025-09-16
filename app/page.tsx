"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, BookOpen, ExternalLink, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { QuizInterface } from "@/components/quiz-interface"
import type { Quiz } from "@/types/quiz"

export default function QuizApp() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const { toast } = useToast()

  const handleGenerateQuiz = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to fetch content.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Fetch content first
      const contentResponse = await fetch("/api/fetch-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!contentResponse.ok) {
        throw new Error("Failed to fetch content")
      }

      const contentData = await contentResponse.json()

      // Generate quiz from content
      const quizResponse = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: contentData.content }),
      })

      if (!quizResponse.ok) {
        throw new Error("Failed to generate quiz")
      }

      const quizData = await quizResponse.json()
      setQuiz(quizData)

      toast({
        title: "Quiz Generated!",
        description: `Created ${quizData.questions.length} questions from the content.`,
      })
    } catch (error) {
      console.error("Error generating quiz:", error)
      toast({
        title: "Error",
        description: "Failed to generate quiz questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartQuiz = () => {
    setShowQuiz(true)
  }

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} out of ${totalQuestions} questions correctly.`,
    })
  }

  const handleBackToSetup = () => {
    setShowQuiz(false)
  }

  if (showQuiz && quiz) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Quiz
            </h1>
            <Button variant="outline" onClick={handleBackToSetup}>
              Back to Setup
            </Button>
          </div>
          <QuizInterface quiz={quiz} onQuizComplete={handleQuizComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Quiz Generator
          </h1>
          <p className="text-muted-foreground text-lg">Transform documentation into interactive learning experiences</p>
        </div>

        {/* URL Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Generate Quiz from Documentation
            </CardTitle>
            <CardDescription>
              Enter a documentation URL to automatically fetch content and generate quiz questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Documentation URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://docusaurus.io/docs/introduction"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleGenerateQuiz} disabled={isLoading || !url} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                "Generate Quiz Questions"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quiz Preview & Start */}
        {quiz && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                Quiz Ready
              </CardTitle>
              <CardDescription>{quiz.questions.length} questions generated and ready to take</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {quiz.questions.map((question, index) => (
                  <div key={question.id} className="p-3 bg-muted rounded-lg">
                    <p className="font-medium text-sm">
                      {index + 1}. {question.question}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="truncate">
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleStartQuiz} className="w-full" size="lg">
                <Play className="mr-2 h-4 w-4" />
                Start Interactive Quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
