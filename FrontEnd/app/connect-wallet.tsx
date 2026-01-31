import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, Shield, CheckCircle, ArrowLeft } from 'lucide-react-native';
import Button from '@/components/Button';
import { TouchableOpacity } from 'react-native';

export default function ConnectWalletScreen() {
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = (walletType: string) => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      Alert.alert(
        'Wallet Connected',
        `Successfully connected to ${walletType}!`,
        [
          {
            text: 'Continue',
            onPress: () => router.push('/(voter)/dashboard'),
          },
        ]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <View style={styles.iconContainer}>
            <Shield size={48} color="#2563EB" />
          </View>
          <Text style={styles.title}>Secure Wallet Connection</Text>
          <Text style={styles.description}>
            Connect your wallet to participate in voting. Your wallet is your
            identity on the blockchain. We never store your private keys.
          </Text>
        </View>

        <View style={styles.walletList}>
          <WalletOption
            name="MetaMask"
            description="Popular browser wallet"
            onConnect={() => handleConnect('MetaMask')}
            disabled={connecting}
          />
          <WalletOption
            name="WalletConnect"
            description="Mobile wallet connection"
            onConnect={() => handleConnect('WalletConnect')}
            disabled={connecting}
          />
          <WalletOption
            name="Coinbase Wallet"
            description="Secure and easy to use"
            onConnect={() => handleConnect('Coinbase Wallet')}
            disabled={connecting}
          />
          <WalletOption
            name="Trust Wallet"
            description="Multi-chain support"
            onConnect={() => handleConnect('Trust Wallet')}
            disabled={connecting}
          />
        </View>

        <View style={styles.securitySection}>
          <Text style={styles.securityTitle}>Security Features</Text>
          <SecurityFeature
            icon={CheckCircle}
            text="End-to-end encryption"
          />
          <SecurityFeature icon={CheckCircle} text="No private key storage" />
          <SecurityFeature
            icon={CheckCircle}
            text="Audited smart contracts"
          />
          <SecurityFeature
            icon={CheckCircle}
            text="Regular security updates"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function WalletOption({
  name,
  description,
  onConnect,
  disabled,
}: {
  name: string;
  description: string;
  onConnect: () => void;
  disabled: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.walletOption}
      onPress={onConnect}
      disabled={disabled}
      activeOpacity={0.7}>
      <View style={styles.walletIconContainer}>
        <Wallet size={28} color="#2563EB" />
      </View>
      <View style={styles.walletInfo}>
        <Text style={styles.walletName}>{name}</Text>
        <Text style={styles.walletDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

function SecurityFeature({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<any>;
  text: string;
}) {
  return (
    <View style={styles.securityFeature}>
      <Icon size={20} color="#10B981" />
      <Text style={styles.securityFeatureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  walletList: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  walletIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  walletDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  securitySection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  securityFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  securityFeatureText: {
    fontSize: 15,
    color: '#374151',
  },
});
