"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, Users, Zap, ArrowRight, Github, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const teamMembers = [
  { name: "Ahmed Abdullah", role: "Lead Developer", icon: User },
  { name: "Sheheryar Altaf", role: "Algorithm Specialist", icon: User },
  { name: "Abdul Manan", role: "Performance Analyst", icon: User },
  { name: "Muhammad Awais", role: "UI/UX Developer", icon: User },
]

const features = [
  {
    icon: Calculator,
    title: "Dual Methods",
    description: "Choose between LU Decomposition and Gaussian Elimination for matrix inversion",
  },
  {
    icon: Zap,
    title: "Parallel Processing",
    description: "Harness the power of multiprocessing for faster computation on large matrices",
  },
  {
    icon: Users,
    title: "Performance Comparison",
    description: "Compare serial vs parallel execution times with detailed analytics",
  },
]

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 container mx-auto px-6 py-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">MatrixInvert</span>
          </div>
          <div className="flex space-x-4">
            <Link href="https://github.com/abdulmanan093/Matrix-Inversion" target="_blank">
              <Button variant="ghost" className="text-white hover:text-purple-300">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
            </Link>
            <Button variant="ghost" className="text-white hover:text-purple-300">
              <Mail className="h-5 w-5 mr-2" />
              Contact
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 container mx-auto px-6 py-20 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          PARALLEL MATRIX
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">INVERSION</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Using Gaussian Elimination & LU Decomposition with High-Performance Computing
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/calculator">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              Start Computing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="relative z-10 container mx-auto px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <h2 className="text-4xl font-bold text-white text-center mb-16">Powerful Features</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 h-full">
                <CardHeader className="text-center">
                  <motion.div
                    animate={{
                      scale: hoveredFeature === index ? 1.1 : 1,
                      rotate: hoveredFeature === index ? 5 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  </motion.div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="relative z-10 container mx-auto px-6 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <h2 className="text-4xl font-bold text-white text-center mb-16">Meet Our Team</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <member.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-white">{member.name}</CardTitle>
                  <CardDescription className="text-purple-300">{member.role}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="relative z-10 container mx-auto px-6 py-20 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <h2 className="text-4xl font-bold text-white mb-8">Ready to Experience Parallel Computing?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Test our high-performance matrix inversion algorithms with your own matrices or let us generate them for you.
        </p>
        <Link href="/calculator">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
          >
            Launch Calculator
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-gray-400">© 2024 Matrix Inversion Project by Abdul Manan. Built with Next.js and Python.</p>
        </div>
      </footer>
    </div>
  )
}
