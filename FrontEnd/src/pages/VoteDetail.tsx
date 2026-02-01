import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockVotes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { VoteCategory } from '@/types';

const categoryStyles: Record<VoteCategory, string> = {
  governance: 'badge-governance',
  community: 'badge-community',
  financial: 'badge-financial',
  technical: 'badge-technical',
};

const categoryLabels: Record<VoteCategory, string> = {
  governance: 'Governance',
  community: 'Community',
  financial: 'Financial',
  technical: 'Technical',
};

export default function VoteDetail() {
  const { id } = useParams();
  const vote = mockVotes.find((v) => v.id === id);
  const [selectedOption, setSelectedOption] = useState<string | null>(vote?.userVote || null);
  const [hasSubmitted, setHasSubmitted] = useState(vote?.hasVoted || false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!vote) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h1 className="mb-2 text-xl font-bold text-foreground">Vote Not Found</h1>
          <p className="mb-4 text-muted-foreground">This proposal doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/votes">Back to Votes</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getDaysRemaining = () => {
    const end = new Date(vote.endDate);
    const now = new Date();
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days remaining` : 'Voting ended';
  };

  const handleVote = () => {
    if (selectedOption) {
      setShowConfirmation(true);
    }
  };

  const confirmVote = () => {
    setHasSubmitted(true);
    setShowConfirmation(false);
  };

  const canVote = vote.status === 'active' && !hasSubmitted;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/votes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="truncate text-lg font-semibold text-foreground">Vote Details</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Vote Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          {/* Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full px-3 py-1 text-sm font-medium', categoryStyles[vote.category])}>
              {categoryLabels[vote.category]}
            </span>
            {vote.status === 'active' && (
              <span className="badge-active rounded-full px-3 py-1 text-sm font-medium">Active</span>
            )}
            {vote.status === 'ended' && (
              <span className="badge-ended rounded-full px-3 py-1 text-sm font-medium">Ended</span>
            )}
            {hasSubmitted && (
              <span className="badge-voted rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Voted
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">{vote.title}</h2>
          <p className="mb-4 text-muted-foreground">{vote.description}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {vote.totalVotes.toLocaleString()} votes
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {getDaysRemaining()}
            </span>
          </div>
        </motion.div>

        {/* Voting Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 space-y-3"
        >
          <h3 className="text-lg font-semibold text-foreground">
            {canVote ? 'Cast Your Vote' : 'Results'}
          </h3>

          {vote.options.map((option, index) => {
            const isSelected = selectedOption === option.id;
            const isWinner = vote.status === 'ended' && option.percentage === Math.max(...vote.options.map(o => o.percentage));

            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => canVote && setSelectedOption(option.id)}
                disabled={!canVote}
                className={cn(
                  'relative w-full overflow-hidden rounded-xl border p-4 text-left transition-all',
                  canVote && 'cursor-pointer hover:border-primary/50',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card',
                  isWinner && 'border-success/50',
                  !canVote && 'cursor-default'
                )}
              >
                {/* Background progress bar */}
                <div
                  className={cn(
                    'absolute inset-0 transition-all duration-700',
                    isWinner ? 'bg-success/10' : 'bg-primary/5'
                  )}
                  style={{ width: hasSubmitted || vote.status === 'ended' ? `${option.percentage}%` : '0%' }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Radio indicator */}
                    {canVote && (
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                        )}
                      >
                        {isSelected && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
                      </div>
                    )}
                    <span className="font-medium text-foreground">{option.label}</span>
                  </div>

                  {/* Vote count & percentage */}
                  {(hasSubmitted || vote.status === 'ended') && (
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{option.percentage}%</p>
                      <p className="text-xs text-muted-foreground">{option.votes.toLocaleString()} votes</p>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Participation Progress */}
        {vote.status === 'active' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Quorum Progress</span>
              <span className="font-medium text-foreground">
                {vote.totalVotes.toLocaleString()} / {vote.quorum.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((vote.totalVotes / vote.quorum) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </motion.div>
        )}

        {/* Vote Button */}
        {canVote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              disabled={!selectedOption}
              onClick={handleVote}
            >
              Submit Vote
            </Button>
          </motion.div>
        )}
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg"
            >
              <h3 className="mb-2 text-xl font-bold text-foreground">Confirm Your Vote</h3>
              <p className="mb-6 text-muted-foreground">
                You are about to vote for:{' '}
                <span className="font-medium text-foreground">
                  {vote.options.find((o) => o.id === selectedOption)?.label}
                </span>
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                This action cannot be undone. Your vote will be recorded on the blockchain.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </Button>
                <Button variant="success" className="flex-1" onClick={confirmVote}>
                  Confirm Vote
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
