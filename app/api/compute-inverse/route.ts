import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { method, matrix_size, matrix_input } = await request.json()

    if (!method || !matrix_size || !matrix_input) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Validate matrix input
    const elements = matrix_input
      .trim()
      .split(/\s+/)
      .map((x: string) => {
        const num = Number.parseFloat(x)
        if (isNaN(num)) {
          throw new Error(`Invalid number: ${x}`)
        }
        return num
      })

    if (elements.length !== matrix_size * matrix_size) {
      return NextResponse.json(
        { error: `Expected ${matrix_size * matrix_size} elements, got ${elements.length}` },
        { status: 400 },
      )
    }

    return new Promise((resolve) => {
      const pythonScript = method === "lu" ? "lu_inversion.py" : "gauss_inversion.py"
      const scriptPath = path.join(process.cwd(), "scripts", pythonScript)

      // Determine Python executable path in a portable way
      const pythonPath = process.env.PYTHON_PATH || (process.platform === "win32" ? "python" : "python3")
      const python = spawn(pythonPath, [scriptPath], {
        stdio: ["pipe", "pipe", "pipe"],
      })

      let stdout = ""
      let stderr = ""

      python.stdout.on("data", (data) => {
        stdout += data.toString()
      })

      python.stderr.on("data", (data) => {
        stderr += data.toString()
      })

      python.on("close", (code) => {
        if (code !== 0) {
          console.error("Python stderr:", stderr)
          resolve(NextResponse.json({ error: `Computation failed: ${stderr || "Unknown error"}` }, { status: 500 }))
          return
        }

        try {
          // Clean the stdout to ensure it's valid JSON
          const cleanOutput = stdout.trim()
          if (!cleanOutput) {
            resolve(NextResponse.json({ error: "No output from Python script" }, { status: 500 }))
            return
          }

          const result = JSON.parse(cleanOutput)

          if (result.error) {
            resolve(NextResponse.json({ error: result.error }, { status: 400 }))
            return
          }

          resolve(NextResponse.json(result))
        } catch (parseError) {
          console.error("JSON parse error:", parseError)
          console.error("Raw output:", stdout)
          resolve(NextResponse.json({ error: "Failed to parse computation result" }, { status: 500 }))
        }
      })

      python.on("error", (error) => {
        console.error("Python process error:", error)
        resolve(NextResponse.json({ error: "Failed to start Python process" }, { status: 500 }))
      })

      // Send input to Python script
      const input = JSON.stringify({
        matrix_size,
        matrix_elements: elements,
        method: method === "lu" ? "LU Decomposition" : "Gaussian Elimination"
      })

      python.stdin.write(input)
      python.stdin.end()
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
