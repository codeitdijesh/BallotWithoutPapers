import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { VoteCard } from '@/components/VoteCard';
import { mockVotes } from '@/data/mockData';

export default function Results() {
  const endedVotes = mockVotes.filter((v) => v.status === 'ended');

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
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Past Results</h1>
          <p className="mt-1 text-muted-foreground">
            View completed proposals and their final outcomes
          </p>
        </motion.div>

        {/* Results List */}
        {endedVotes.length > 0 ? (
          <div className="space-y-4">
            {endedVotes.map((vote, index) => (
              <VoteCard key={vote.id} vote={vote} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-card p-12 text-center"
          >
            <p className="text-muted-foreground">No completed votes yet</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
