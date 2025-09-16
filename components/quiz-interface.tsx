"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Trophy, Brain, Sparkles } from "lucide-react"
import { Confetti } from "@/components/confetti"
import type { Quiz, QuizState } from "@/types/quiz"

interface QuizInterfaceProps {
  quiz: Quiz
  onQuizComplete: (score: number, totalQuestions: number) => void
}

export function QuizInterface({ quiz, onQuizComplete }: QuizInterfaceProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswers: new Array(quiz.questions.length).fill(null),
    showResults: false,
    score: 0,
  })

  const [showConfetti, setShowConfetti] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false)

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex]
  const progress = ((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...quizState.selectedAnswers]
    newSelectedAnswers[quizState.currentQuestionIndex] = answerIndex

    const correct = answerIndex === currentQuestion.correctAnswer
    setIsCorrectAnswer(correct)
    setShowFeedback(true)

    if (correct) {
      setShowConfetti(true)
    }

    setQuizState((prev) => ({
      ...prev,
      selectedAnswers: newSelectedAnswers,
    }))
  }

  const handleNext = () => {
    setShowFeedback(false)
    setShowConfetti(false)

    if (quizState.currentQuestionIndex < quiz.questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }))
    } else {
      // Calculate final score
      const score = quizState.selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0)
      }, 0)

      setQuizState((prev) => ({
        ...prev,
        showResults: true,
        score,
      }))

      setShowConfetti(true)
      onQuizComplete(score, quiz.questions.length)
    }
  }

  const handlePrevious = () => {
    setShowFeedback(false)
    setShowConfetti(false)

    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }))
    }
  }

  const handleRestart = () => {
    setQuizState({
      currentQuestionIndex: 0,
      selectedAnswers: new Array(quiz.questions.length).fill(null),
      showResults: false,
      score: 0,
    })
    setShowFeedback(false)
    setShowConfetti(false)
  }

  const isAnswerSelected = quizState.selectedAnswers[quizState.currentQuestionIndex] !== null
  const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestionIndex]

  if (quizState.showResults) {
    return (
      <>
        <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Trophy className="h-6 w-6 text-secondary" />
              Quiz Complete!
            </CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {quizState.score}/{quiz.questions.length}
              </div>
              <div className="text-lg text-muted-foreground">
                {Math.round((quizState.score / quiz.questions.length) * 100)}% Correct
              </div>
            </div>

            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const userAnswer = quizState.selectedAnswers[index]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant={isCorrect ? "default" : "destructive"}>
                              Your answer: {question.options[userAnswer || 0]}
                            </Badge>
                          </div>
                          {!isCorrect && (
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Correct: {question.options[question.correctAnswer]}</Badge>
                            </div>
                          )}
                          <p className="text-muted-foreground text-xs mt-2">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button onClick={handleRestart} className="w-full bg-transparent" variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-secondary" />
              Interactive Quiz
            </CardTitle>
            <Badge variant="outline">
              {quizState.currentQuestionIndex + 1} of {quiz.questions.length}
            </Badge>
          </div>
          <CardDescription>Test your knowledge of the documentation</CardDescription>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-balance">{currentQuestion.question}</h3>

            {showFeedback && (
              <div
                className={`mb-4 p-3 rounded-lg border ${
                  isCorrectAnswer
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCorrectAnswer ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span className="font-medium">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span className="font-medium">Incorrect.</span>
                    </>
                  )}
                </div>
                <p className="text-sm mt-1">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => {
                let variant: "default" | "outline" | "destructive" | "secondary" = "outline"

                if (showFeedback && selectedAnswer === index) {
                  variant = isCorrectAnswer ? "default" : "destructive"
                } else if (showFeedback && index === currentQuestion.correctAnswer) {
                  variant = "secondary"
                } else if (selectedAnswer === index) {
                  variant = "default"
                }

                return (
                  <Button
                    key={index}
                    variant={variant}
                    className="justify-start text-left h-auto p-4 text-wrap"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    <span className="text-pretty">{option}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={quizState.currentQuestionIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={!isAnswerSelected}>
              {quizState.currentQuestionIndex === quiz.questions.length - 1 ? "Finish Quiz" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
