# BWP - Blockchain Voting Platform (Frontend)

A mobile-first voting platform built with Expo, React Native, and TypeScript. This is a UI-only implementation showcasing a complete voting experience without blockchain integration.

## Project Structure

```
app/
├── _layout.tsx                 # Root navigation layout
├── index.tsx                   # Landing/public screen
├── connect-wallet.tsx          # Wallet connection UI (placeholder)
├── (voter)/                    # Voter interface (tab navigation)
│   ├── _layout.tsx            # Tab navigation setup
│   ├── dashboard.tsx          # Main dashboard with metrics
│   ├── active.tsx             # Active votes list
│   ├── results.tsx            # Past results
│   └── profile.tsx            # User profile
├── (admin)/                    # Admin interface (stack navigation)
│   ├── _layout.tsx            # Stack navigation setup
│   ├── dashboard.tsx          # Admin dashboard with metrics
│   ├── create.tsx             # Create new proposal
│   └── manage.tsx             # Manage all proposals
└── vote/
    └── [id].tsx               # Vote detail and voting interface

components/
├── Button.tsx                  # Reusable button with variants
├── VoteCard.tsx               # Vote summary card
├── MetricCard.tsx             # Metric display card
├── ProposalCard.tsx           # Admin proposal card
└── EmptyState.tsx             # Empty state placeholder

constants/
└── mockData.ts                # Mock data for all screens

types/
└── index.ts                   # TypeScript interfaces
```

## Features

### Public/Landing Screen
- Modern, gradient hero section with clear branding
- Feature showcase with icons and descriptions
- Trust indicators (statistics, security features)
- Multiple call-to-action buttons
- Fully responsive design

### Voter Interface
**Dashboard**
- Welcome header with wallet connection status
- Four key metrics (voting power, total votes, active votes, rank)
- Active votes section
- Upcoming votes section
- Quick navigation to vote details

**Active Votes**
- Filterable list (All, Voted, Not Voted)
- Vote status indicators
- Category badges with color coding
- Participation metrics

**Results**
- Historical voting results
- Past vote details
- Final vote tallies

**Profile**
- User information and wallet address
- Voting statistics
- Settings and account management
- Disconnect wallet option

**Vote Detail**
- Full proposal information
- Category and status indicators
- Time remaining countdown
- Interactive voting options with radio selection
- Real-time result visualization
- Vote confirmation flow

### Admin Interface
**Dashboard**
- Red-themed header for visual distinction
- Quick action buttons (Create Proposal, Manage All)
- Overview metrics (proposals, participants, participation rate)
- Recent proposals list
- Administrative controls

**Create Proposal**
- Form with validation
- Category selection (Governance, Community, Financial, Technical)
- Date range picker
- Dynamic voting options (add/remove)
- Preview and submit

**Manage Proposals**
- Filterable proposal list (All, Active, Upcoming, Ended)
- Proposal cards with quick actions
- Edit, delete, and view stats buttons
- Status indicators

## Design Decisions

### Color Palette
- Primary Blue: `#2563EB` - Trust, reliability, blockchain
- Success Green: `#10B981` - Active votes, confirmations
- Warning Orange: `#F59E0B` - Upcoming events, attention
- Admin Red: `#DC2626` - Admin-only areas, visual separation
- Purple: `#8B5CF6` - Technical category
- Neutrals: Gray scale for text and backgrounds

### Typography
- Headers: 800 weight for strong hierarchy
- Body: 400-600 weight range
- Clear size scale (12-48px) for consistent hierarchy

### Component Design
- Rounded corners (12-20px) for modern feel
- Soft shadows for depth
- Card-based layout for content organization
- Consistent spacing (8px grid system)

### Navigation
- Tab navigation for voter interface (4 main sections)
- Stack navigation for admin (hierarchical flow)
- Clear visual distinction between user roles

### User Experience
- Immediate visual feedback on interactions
- Loading states for async operations
- Empty states with helpful messaging
- Error handling with user-friendly alerts
- Progressive disclosure (dashboard → detail views)

## Mock Data
All data is simulated using `mockData.ts`:
- 5 sample votes across different categories and statuses
- 2 user profiles (regular user, admin)
- Admin metrics
- Realistic vote options and participation data

## Accessibility
- Semantic component structure
- Touch targets 44x44px minimum
- Clear color contrast ratios
- Loading states for screen readers
- Descriptive labels

## Performance Optimizations
- Component-based architecture for reusability
- Minimal re-renders with proper state management
- Efficient list rendering
- Optimized navigation structure

## Future Enhancements (Backend Required)
- Actual wallet integration (MetaMask, WalletConnect)
- Blockchain transaction signing
- Real-time vote tallying
- Push notifications
- Multi-language support
- Dark mode theme
- Advanced analytics dashboard
- Vote delegation features

## Running the App

```bash
npm install
npm run dev
```

Choose your preferred platform:
- Press 'w' for web
- Scan QR code for mobile (iOS/Android)

## Design Philosophy
The UI is designed to build trust and credibility through:
- Professional, clean aesthetic
- Clear information hierarchy
- Consistent design language
- Transparency indicators
- Security-focused messaging
- Accessible to non-technical users
