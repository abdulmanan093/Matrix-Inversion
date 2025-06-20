import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { size } = await request.json()

    if (!size || size <= 0 || size > 5000) {
      return NextResponse.json({ error: "Invalid matrix size. Must be between 1 and 5000." }, { status: 400 })
    }

    // Generate random matrix with integers between -100 and 100
    const matrix: number[] = []
    for (let i = 0; i < size * size; i++) {
      matrix.push(Math.floor(Math.random() * 201) - 100) // Random integer between -100 and 100
    }

    return NextResponse.json({
      matrix: matrix.join(" "),
      matrix_array: matrix,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate matrix" }, { status: 500 })
  }
}
