import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Vote, Lock, CheckCircle, BarChart3, Users } from 'lucide-react-native';
import Button from '@/components/Button';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();

  const handleStartVoting = () => {
    router.push('/(voter)/dashboard');
  };

  const handleConnectWallet = () => {
    router.push('/connect-wallet');
  };

  const handleAdminAccess = () => {
    router.push('/(admin)/dashboard');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1E40AF', '#2563EB', '#3B82F6']}
        style={styles.heroSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.heroContent}>
          <View style={styles.logoContainer}>
            <Shield size={48} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={styles.heroTitle}>BWP</Text>
          <Text style={styles.heroSubtitle}>Blockchain Voting Platform</Text>
          <Text style={styles.heroDescription}>
            Secure, transparent, and tamper-proof voting powered by blockchain
            technology. Your voice matters, your vote is protected.
          </Text>

          <View style={styles.ctaButtons}>
            <Button
              title="Start Voting"
              onPress={handleStartVoting}
              variant="secondary"
              size="large"
              fullWidth
            />
            <Button
              title="Connect Wallet"
              onPress={handleConnectWallet}
              variant="outline"
              size="large"
              fullWidth
              style={styles.outlineButton}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose BWP?</Text>
        <Text style={styles.sectionSubtitle}>
          Built on blockchain technology for maximum security and transparency
        </Text>

        <View style={styles.features}>
          <FeatureCard
            icon={Lock}
            title="Secure & Immutable"
            description="All votes are cryptographically secured and stored on the blockchain, making them tamper-proof and permanent."
          />
          <FeatureCard
            icon={CheckCircle}
            title="Transparent & Verifiable"
            description="Every vote can be independently verified while maintaining voter privacy through advanced encryption."
          />
          <FeatureCard
            icon={BarChart3}
            title="Real-Time Results"
            description="Track voting progress and results in real-time with complete transparency and accuracy."
          />
          <FeatureCard
            icon={Users}
            title="Democratic Governance"
            description="Participate in community decisions with fair representation and equal voting power."
          />
        </View>
      </View>

      <View style={styles.trustSection}>
        <Text style={styles.trustTitle}>Trusted by Communities Worldwide</Text>
        <View style={styles.statsRow}>
          <StatCard value="10K+" label="Active Voters" />
          <StatCard value="500+" label="Proposals" />
          <StatCard value="99.9%" label="Uptime" />
        </View>
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
        <Text style={styles.ctaDescription}>
          Join thousands of users making their voices heard through secure
          blockchain voting.
        </Text>
        <View style={styles.ctaSectionButtons}>
          <Button
            title="Start Voting Now"
            onPress={handleStartVoting}
            variant="primary"
            size="large"
            fullWidth
          />
          <Button
            title="Admin Access"
            onPress={handleAdminAccess}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.adminButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIconContainer}>
        <Icon size={28} color="#2563EB" strokeWidth={2} />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#DBEAFE',
    marginBottom: 16,
    fontWeight: '600',
  },
  heroDescription: {
    fontSize: 16,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  ctaButtons: {
    width: '100%',
    gap: 12,
  },
  outlineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  features: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  trustSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
  },
  trustTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  ctaSectionButtons: {
    width: '100%',
    gap: 12,
  },
  adminButton: {
    marginTop: 8,
  },
});
