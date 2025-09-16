import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { groq } from "@ai-sdk/groq"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Ensure GROQ_API_KEY is present; support fallback from XAI_API_KEY (user's current .env)
    if (!process.env.GROQ_API_KEY && process.env.XAI_API_KEY) {
      process.env.GROQ_API_KEY = process.env.XAI_API_KEY
    }
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY in environment" }, { status: 500 })
    }

    const quizSchema = z.object({
      questions: z
        .array(
          z.object({
            id: z.string(),
            question: z.string(),
            options: z.array(z.string()).length(4),
            correctAnswer: z.number().int().min(0).max(3),
            explanation: z.string(),
          })
        )
        .length(5),
    })

    const { object } = await generateObject({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      schema: quizSchema,
      prompt: `You are generating a JSON object that represents a 5-question multiple-choice quiz. Each question has exactly 4 options and only one correct answer. Do not include any commentary or prose, only return a JSON object that matches the provided schema.

Content: ${content}

Requirements:
- Questions should test comprehension, not just memorization
- Options should be plausible but clearly distinguishable
- Include explanations for the correct answers
- Focus on the most important concepts from the content
- Make questions engaging and educational

Return only valid JSON strictly matching the schema.`,
    })

    return NextResponse.json(object)
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz questions" }, { status: 500 })
  }
}
