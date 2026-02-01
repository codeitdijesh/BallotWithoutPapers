import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { VoteCard } from '@/components/VoteCard';
import { Button } from '@/components/ui/button';
import { mockVotes } from '@/data/mockData';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'voted' | 'not-voted';

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Voted', value: 'voted' },
  { label: 'Not Voted', value: 'not-voted' },
];

export default function ActiveVotes() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const activeVotes = mockVotes.filter((v) => v.status === 'active');

  const filteredVotes = activeVotes.filter((vote) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'voted') return vote.hasVoted;
    if (activeFilter === 'not-voted') return !vote.hasVoted;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pt-20">
      <Navigation />

      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Active Votes</h1>
          <p className="mt-1 text-muted-foreground">
            {activeVotes.length} proposals currently accepting votes
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center gap-2 overflow-x-auto pb-2"
        >
          <Filter className="h-4 w-4 text-muted-foreground" />
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'shrink-0',
                activeFilter === filter.value && 'shadow-md'
              )}
            >
              {filter.label}
            </Button>
          ))}
        </motion.div>

        {/* Votes List */}
        {filteredVotes.length > 0 ? (
          <div className="space-y-4">
            {filteredVotes.map((vote, index) => (
              <VoteCard key={vote.id} vote={vote} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card p-12 text-center"
          >
            <p className="text-muted-foreground">No votes match your filter</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
