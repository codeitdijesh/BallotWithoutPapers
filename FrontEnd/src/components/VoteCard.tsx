import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { Vote, VoteCategory } from '@/types';
import { cn } from '@/lib/utils';

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

interface VoteCardProps {
  vote: Vote;
  index?: number;
}

export function VoteCard({ vote, index = 0 }: VoteCardProps) {
  const getStatusBadge = () => {
    switch (vote.status) {
      case 'active':
        return <span className="badge-active rounded-full px-2 py-0.5 text-xs font-medium">Active</span>;
      case 'upcoming':
        return <span className="badge-upcoming rounded-full px-2 py-0.5 text-xs font-medium">Upcoming</span>;
      case 'ended':
        return <span className="badge-ended rounded-full px-2 py-0.5 text-xs font-medium">Ended</span>;
    }
  };

  const getDaysRemaining = () => {
    const end = new Date(vote.endDate);
    const now = new Date();
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Ended';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/vote/${vote.id}`}
        className="group block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg md:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Category & Status */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', categoryStyles[vote.category])}>
                {categoryLabels[vote.category]}
              </span>
              {getStatusBadge()}
              {vote.hasVoted && (
                <span className="badge-voted rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Voted
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {vote.title}
            </h3>

            {/* Description */}
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {vote.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {vote.totalVotes.toLocaleString()} votes
              </span>
              {vote.status !== 'ended' && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {getDaysRemaining()}
                </span>
              )}
            </div>

            {/* Progress bar for participation */}
            {vote.status === 'active' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Participation</span>
                  <span className="font-medium text-foreground">{vote.currentParticipation}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${vote.currentParticipation}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </div>
            )}
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </Link>
    </motion.div>
  );
}
