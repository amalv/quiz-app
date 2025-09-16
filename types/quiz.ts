export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface Quiz {
  questions: QuizQuestion[]
}

export interface QuizState {
  currentQuestionIndex: number
  selectedAnswers: (number | null)[]
  showResults: boolean
  score: number
}
