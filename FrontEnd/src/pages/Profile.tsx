import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Wallet, Calendar, Trophy, Vote, LogOut, Settings, ChevronRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/data/mockData';

export default function Profile() {
  const stats = [
    { icon: Vote, label: 'Total Votes', value: mockUser.metrics.totalVotes },
    { icon: Trophy, label: 'Rank', value: `#${mockUser.metrics.rank}` },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-2xl border border-border bg-gradient-to-br from-card to-secondary p-6 text-center"
        >
          {/* Avatar */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <User className="h-10 w-10 text-primary-foreground" />
          </div>

          {/* Name & Wallet */}
          <h1 className="mb-1 text-2xl font-bold text-foreground">{mockUser.displayName}</h1>
          <div className="mb-4 flex items-center justify-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span className="font-mono text-sm">{mockUser.walletAddress}</span>
          </div>

          {/* Join Date */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Member since {new Date(mockUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 grid grid-cols-2 gap-4"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Voting Power Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Voting Power</p>
              <p className="text-3xl font-bold gradient-text">{mockUser.metrics.votingPower.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-primary/20 p-3">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-2"
        >
          <button className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Settings</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Disconnect Wallet
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
