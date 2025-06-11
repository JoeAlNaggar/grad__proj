"use client"

import { motion } from "framer-motion"
import { Github, Code, GitBranch, GitPullRequest } from "lucide-react"

export default function AnimatedAd() {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white overflow-hidden relative">
      <motion.div
        className="absolute top-2 right-2 text-white"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <Github size={24} />
      </motion.div>
      <h3 className="text-2xl font-bold mb-2">Collaborate on GitHub!</h3>
      <p className="mb-4">Join millions of developers and contribute to open-source projects.</p>
      <motion.div
        className="flex space-x-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center">
          <Code size={20} className="mr-2" />
          <span>Code Together</span>
        </div>
        <div className="flex items-center">
          <GitBranch size={20} className="mr-2" />
          <span>Manage Branches</span>
        </div>
        <div className="flex items-center">
          <GitPullRequest size={20} className="mr-2" />
          <span>Review PRs</span>
        </div>
      </motion.div>
      <motion.button
        className="mt-4 bg-white text-gray-900 px-4 py-2 rounded-full font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Join GitHub
      </motion.button>
    </div>
  )
}
