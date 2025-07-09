"use client";

import { useAuth } from "../../contexts/AuthContext";
import BentoCard from "../components/BentoCard"
import StreaksSection from "../components/StreaksSection"
import Calendar from "../components/Calendar"
import SecurityTips from "../components/SecurityTips"
import AnimatedAd from "../components/AnimatedAd"
import NotificationsList from "../components/NotificationsList"
import QuickActionsCard from "../components/QuickActionsCard"
import { motion } from "framer-motion"




export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getUserDisplayName = () => {
    if (user?.first_name) {
      return user.first_name;
    }
    return user?.username || "User";
  };

  return (
    <div className="space-y-8">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl mx-auto">

      <header className="bg-white dark:bg-gray-800/50 backdrop-filter backdrop-blur-lg border border-white/10 dark:border-white/5 rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome back, {getUserDisplayName()}!
        </h1>
      </header>

            <StreaksSection />

      <QuickActionsCard />


      <BentoCard className="col-span-full">
        <NotificationsList />
      </BentoCard>

      <BentoCard className="col-span-full">
        <AnimatedAd />
      </BentoCard>

      <BentoCard className="col-span-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Events</h2>
        <Calendar />
      </BentoCard>

      <BentoCard className="col-span-full">
        <SecurityTips />
      </BentoCard>

      </motion.div>
    </div>
  )
} 