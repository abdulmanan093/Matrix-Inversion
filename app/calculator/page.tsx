"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calculator, Zap, Clock, Download, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ComputationResult {
  inverse_matrix: number[][]
  serial_time: number
  parallel_time: number
  method: string
  matrix_size: number
}

export default function CalculatorPage() {
  const [method, setMethod] = useState<string>("")
  const [matrixSize, setMatrixSize] = useState<string>("")
  const [matrixInput, setMatrixInput] = useState<string>("")
  const [isComputing, setIsComputing] = useState(false)
  const [result, setResult] = useState<ComputationResult | null>(null)
  const [error, setError] = useState<string>("")

  const generateMatrix = async () => {
    if (!matrixSize || Number.parseInt(matrixSize) <= 0) {
      setError("Please enter a valid matrix size")
      return
    }

    const size = Number.parseInt(matrixSize)
    if (size > 5000) {
      setError("Matrix size cannot exceed 5000 due to performance and memory constraints")
      return
    }

    try {
      const response = await fetch("/api/generate-matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: Number.parseInt(matrixSize) }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate matrix")
      }

      const data = await response.json()
      setMatrixInput(data.matrix) // Use the space-separated string format
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate matrix")
    }
  }

  const computeInverse = async () => {
    if (!method || !matrixSize || !matrixInput) {
      setError("Please fill all fields")
      return
    }

    const size = Number.parseInt(matrixSize)
    if (size > 5000) {
      setError("Matrix size cannot exceed 5000 due to performance and memory constraints")
      return
    }

    setIsComputing(true)
    setError("")

    try {
      const response = await fetch("/api/compute-inverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          matrix_size: Number.parseInt(matrixSize),
          matrix_input: matrixInput,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Computation failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Computation failed")
    } finally {
      setIsComputing(false)
    }
  }

  const downloadResult = () => {
    if (!result) return

    const content = `Matrix Inversion Result
Method: ${result.method}
Matrix Size: ${result.matrix_size}x${result.matrix_size}
Serial Time: ${result.serial_time.toFixed(6)} seconds
Parallel Time: ${result.parallel_time.toFixed(6)} seconds
Speedup: ${(result.serial_time / result.parallel_time).toFixed(2)}x

Inverse Matrix:
${result.inverse_matrix.map((row) => row.map((val) => val.toFixed(6)).join("\t")).join("\n")}`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `matrix_inverse_${result.method}_${result.matrix_size}x${result.matrix_size}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        className="container mx-auto px-6 py-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">Matrix Calculator</span>
          </div>
        </nav>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Matrix Configuration
                </CardTitle>
                <CardDescription className="text-gray-300">Configure your matrix inversion computation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Method Selection */}
                <div className="space-y-2">
                  <Label className="text-white">Inversion Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Choose inversion method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lu">LU Decomposition</SelectItem>
                      <SelectItem value="gauss">Gaussian Elimination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Matrix Size */}
                <div className="space-y-2">
                  <Label className="text-white">Matrix Size</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="e.g., 3 for 3x3 matrix"
                      value={matrixSize}
                      onChange={(e) => setMatrixSize(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <Button
                      onClick={generateMatrix}
                      variant="outline"
                      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  {matrixSize && (
                    <p className="text-sm text-gray-400">
                      Will create a {matrixSize}×{matrixSize} matrix
                    </p>
                  )}
                </div>

                {/* Matrix Input */}
                <div className="space-y-2">
                  <Label className="text-white">Matrix Elements</Label>
                  <Textarea
                    placeholder="Enter matrix elements row by row, space-separated..."
                    value={matrixInput}
                    onChange={(e) => setMatrixInput(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[120px] font-mono"
                  />
                  <p className="text-sm text-gray-400">Enter elements row by row, separated by spaces</p>
                </div>

                {/* Compute Button */}
                <Button
                  onClick={computeInverse}
                  disabled={isComputing || !method || !matrixSize || !matrixInput}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {isComputing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Computing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Compute Inverse
                    </>
                  )}
                </Button>

                {/* Error Display */}
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Results
                  </span>
                  {result && (
                    <Button
                      onClick={downloadResult}
                      variant="outline"
                      size="sm"
                      className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </CardTitle>
                <CardDescription className="text-gray-300">Computation results and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <Tabs defaultValue="metrics" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/10">
                      <TabsTrigger value="metrics" className="text-white data-[state=active]:bg-purple-600">
                        Performance
                      </TabsTrigger>
                      <TabsTrigger value="matrix" className="text-white data-[state=active]:bg-purple-600">
                        Matrix
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="metrics" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <p className="text-sm text-gray-400">Method</p>
                          <Badge variant="secondary" className="mt-1">
                            {result.method}
                          </Badge>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <p className="text-sm text-gray-400">Matrix Size</p>
                          <p className="text-lg font-semibold text-white">
                            {result.matrix_size}×{result.matrix_size}
                          </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <p className="text-sm text-gray-400">Serial Time</p>
                          <p className="text-lg font-semibold text-blue-400">{result.serial_time.toFixed(6)}s</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <p className="text-sm text-gray-400">Parallel Time</p>
                          <p className="text-lg font-semibold text-green-400">{result.parallel_time.toFixed(6)}s</p>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                        <p className="text-sm text-gray-300">Performance Improvement</p>
                        {result.parallel_time > result.serial_time ? (
                          <p className="text-2xl font-bold text-white">
                            No speedup (parallel slower)
                          </p>
                        ) : (
                          <>
                            <p className="text-2xl font-bold text-white">
                              {(result.serial_time / result.parallel_time).toFixed(2)}× faster
                            </p>
                            <p className="text-sm text-gray-400">
                              Saved {((result.serial_time - result.parallel_time) * 1000).toFixed(2)}ms
                            </p>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="matrix">
                      <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-auto">
                        <pre className="text-xs text-white font-mono whitespace-pre-wrap">
                          {result.inverse_matrix
                            .map((row) => row.map((val) => val.toFixed(4).padStart(10)).join(" "))
                            .join("\n")}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Configure your matrix and click "Compute Inverse" to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
