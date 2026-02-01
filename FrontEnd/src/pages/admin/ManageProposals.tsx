import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockVotes } from '@/data/mockData';
import { VoteStatus, VoteCategory } from '@/types';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | VoteStatus;

const statusFilters: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Ended', value: 'ended' },
];

const categoryStyles: Record<VoteCategory, string> = {
  governance: 'badge-governance',
  community: 'badge-community',
  financial: 'badge-financial',
  technical: 'badge-technical',
};

export default function ManageProposals() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  const filteredVotes = mockVotes.filter((vote) => {
    if (activeFilter === 'all') return true;
    return vote.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Manage Proposals</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-2 overflow-x-auto pb-2"
        >
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.value)}
              className="shrink-0"
            >
              {filter.label}
            </Button>
          ))}
        </motion.div>

        {/* Proposals List */}
        {filteredVotes.length > 0 ? (
          <div className="space-y-3">
            {filteredVotes.map((vote, index) => (
              <motion.div
                key={vote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', categoryStyles[vote.category])}>
                        {vote.category}
                      </span>
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        vote.status === 'active' && 'badge-active',
                        vote.status === 'upcoming' && 'badge-upcoming',
                        vote.status === 'ended' && 'badge-ended'
                      )}>
                        {vote.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground">{vote.title}</h3>

                    {/* Stats */}
                    <p className="text-sm text-muted-foreground">
                      {vote.totalVotes.toLocaleString()} votes · {vote.currentParticipation}% participation
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/vote/${vote.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card p-12 text-center"
          >
            <p className="text-muted-foreground">No proposals match your filter</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
