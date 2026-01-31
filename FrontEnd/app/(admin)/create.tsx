import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react-native';
import Button from '@/components/Button';

export default function CreateProposalScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('governance');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [isCreating, setIsCreating] = useState(false);

  const categories = [
    { value: 'governance', label: 'Governance', color: '#2563EB' },
    { value: 'community', label: 'Community', color: '#10B981' },
    { value: 'financial', label: 'Financial', color: '#F59E0B' },
    { value: 'technical', label: 'Technical', color: '#8B5CF6' },
  ];

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    if (!title || !description || !startDate || !endDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      Alert.alert('Invalid Options', 'Please provide at least 2 voting options.');
      return;
    }

    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      Alert.alert('Success!', 'Proposal created successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Proposal</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter proposal title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide a detailed description of the proposal"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryButton,
                  category === cat.value && styles.categoryButtonActive,
                  { borderColor: cat.color },
                  category === cat.value && { backgroundColor: `${cat.color}15` },
                ]}
                onPress={() => setCategory(cat.value)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat.value && {
                      color: cat.color,
                      fontWeight: '700',
                    },
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.dateRow}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>
              Start Date <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.label}>
              End Date <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Voting Options <Text style={styles.required}>*</Text>
          </Text>
          {options.map((option, index) => (
            <View key={index} style={styles.optionRow}>
              <TextInput
                style={[styles.input, styles.optionInput]}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChangeText={(value) => updateOption(index, value)}
                placeholderTextColor="#9CA3AF"
              />
              {options.length > 2 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeOption(index)}>
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity
            style={styles.addOptionButton}
            onPress={addOption}
            activeOpacity={0.7}>
            <Plus size={20} color="#2563EB" />
            <Text style={styles.addOptionText}>Add Option</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            size="large"
            fullWidth
          />
          <Button
            title={isCreating ? 'Creating...' : 'Create Proposal'}
            onPress={handleCreate}
            variant="primary"
            size="large"
            fullWidth
            loading={isCreating}
          />
        </View>
      </ScrollView>
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
  contentContainer: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  categoryButtonActive: {
    borderWidth: 2,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  optionInput: {
    flex: 1,
    marginBottom: 0,
  },
  removeButton: {
    padding: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    gap: 8,
    marginTop: 4,
  },
  addOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
