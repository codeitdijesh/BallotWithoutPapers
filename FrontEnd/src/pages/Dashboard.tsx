import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Vote, Trophy, Users, ChevronRight, TrendingUp } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { MetricCard } from '@/components/MetricCard';
import { VoteCard } from '@/components/VoteCard';
import { Button } from '@/components/ui/button';
import { mockUser, mockVotes } from '@/data/mockData';

export default function Dashboard() {
  const activeVotes = mockVotes.filter((v) => v.status === 'active');
  const upcomingVotes = mockVotes.filter((v) => v.status === 'upcoming');

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                Welcome back, <span className="gradient-text">{mockUser.displayName}</span>
              </h1>
              <p className="mt-1 text-muted-foreground">
                Connected: {mockUser.walletAddress}
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/votes">
                View All Votes
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Zap}
            label="Voting Power"
            value={mockUser.metrics.votingPower.toLocaleString()}
            trend="+12%"
            trendUp
            delay={0}
          />
          <MetricCard
            icon={Vote}
            label="Total Votes Cast"
            value={mockUser.metrics.totalVotes}
            delay={0.1}
          />
          <MetricCard
            icon={TrendingUp}
            label="Active Votes"
            value={mockUser.metrics.activeVotes}
            delay={0.2}
          />
          <MetricCard
            icon={Trophy}
            label="Community Rank"
            value={`#${mockUser.metrics.rank}`}
            trend={`of ${mockUser.metrics.totalUsers.toLocaleString()}`}
            delay={0.3}
          />
        </div>

        {/* Active Votes Section */}
        <section className="mb-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4 flex items-center justify-between"
          >
            <h2 className="text-xl font-semibold text-foreground">Active Votes</h2>
            <Link
              to="/votes"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {activeVotes.length > 0 ? (
            <div className="space-y-4">
              {activeVotes.slice(0, 3).map((vote, index) => (
                <VoteCard key={vote.id} vote={vote} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Vote className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No active votes at the moment</p>
            </div>
          )}
        </section>

        {/* Upcoming Votes Section */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-4 flex items-center justify-between"
          >
            <h2 className="text-xl font-semibold text-foreground">Upcoming</h2>
          </motion.div>

          {upcomingVotes.length > 0 ? (
            <div className="space-y-4">
              {upcomingVotes.map((vote, index) => (
                <VoteCard key={vote.id} vote={vote} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No upcoming votes scheduled</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
