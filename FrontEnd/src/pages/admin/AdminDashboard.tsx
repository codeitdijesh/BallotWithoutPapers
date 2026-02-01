import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, List, Users, Vote, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/MetricCard';
import { mockAdminMetrics, mockVotes } from '@/data/mockData';

export default function AdminDashboard() {
  const recentProposals = mockVotes.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-admin/30 bg-admin/10 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-admin to-admin/70">
              <Vote className="h-5 w-5 text-admin-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold text-foreground">BWP Admin</span>
              <p className="text-xs text-admin">Governance Management</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">Exit Admin</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 grid gap-4 sm:grid-cols-2"
        >
          <Button variant="admin" size="xl" asChild className="h-auto py-6">
            <Link to="/admin/create" className="flex flex-col items-center gap-2">
              <Plus className="h-8 w-8" />
              <span className="text-lg font-semibold">Create Proposal</span>
              <span className="text-sm opacity-80">Start a new community vote</span>
            </Link>
          </Button>

          <Button variant="outline" size="xl" asChild className="h-auto py-6 border-border">
            <Link to="/admin/manage" className="flex flex-col items-center gap-2">
              <List className="h-8 w-8" />
              <span className="text-lg font-semibold">Manage All</span>
              <span className="text-sm text-muted-foreground">View and edit proposals</span>
            </Link>
          </Button>
        </motion.div>

        {/* Metrics Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Vote}
            label="Total Proposals"
            value={mockAdminMetrics.totalProposals}
            delay={0}
          />
          <MetricCard
            icon={TrendingUp}
            label="Active Proposals"
            value={mockAdminMetrics.activeProposals}
            delay={0.1}
          />
          <MetricCard
            icon={Users}
            label="Total Participants"
            value={mockAdminMetrics.totalParticipants.toLocaleString()}
            delay={0.2}
          />
          <MetricCard
            icon={BarChart3}
            label="Avg. Participation"
            value={`${mockAdminMetrics.averageParticipation}%`}
            delay={0.3}
          />
        </div>

        {/* Recent Proposals */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4 flex items-center justify-between"
          >
            <h2 className="text-xl font-semibold text-foreground">Recent Proposals</h2>
            <Link
              to="/admin/manage"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="space-y-3">
            {recentProposals.map((vote, index) => (
              <motion.div
                key={vote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{vote.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{vote.totalVotes.toLocaleString()} votes</span>
                    <span className={`capitalize ${vote.status === 'active' ? 'text-success' : vote.status === 'upcoming' ? 'text-warning' : ''}`}>
                      {vote.status}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/vote/${vote.id}`}>View</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
