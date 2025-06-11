"use client";

import { useAuth } from "../../contexts/AuthContext";
import BentoCard from "../components/BentoCard"
import StreaksSection from "../components/StreaksSection"
import Calendar from "../components/Calendar"
import ThunderSpotlight from "../components/ThunderSpotlight"
import SecurityTips from "../components/SecurityTips"
import AnimatedAd from "../components/AnimatedAd"
import OSINTInfoCard from "../components/OSINTInfoCard"
import { FloatingToolsSection } from "../components/FloatingToolsSection"
import NotificationsList from "../components/NotificationsList"
import InboxSection from "../components/InboxSection"
import InnovationStation from "../components/InnovationStation"
import QuickScan from "../components/QuickScan"

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
      <header className="bg-white dark:bg-gray-800/50 backdrop-filter backdrop-blur-lg border border-white/10 dark:border-white/5 rounded-xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome back, {getUserDisplayName()}!
        </h1>
      </header>

      <StreaksSection />

      <BentoCard className="col-span-full">
        <FloatingToolsSection />
      </BentoCard>

      <BentoCard className="col-span-full">
        <QuickScan />
      </BentoCard>

      <BentoCard className="col-span-full">
        <InnovationStation />
      </BentoCard>

      <BentoCard className="col-span-full">
        <NotificationsList />
      </BentoCard>

      <BentoCard className="col-span-full">
        <InboxSection />
      </BentoCard>

      <BentoCard className="col-span-full">
        <OSINTInfoCard />
      </BentoCard>

      <BentoCard className="col-span-full">
        <ThunderSpotlight />
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
    </div>
  )
} 