import { Stack } from 'expo-router/stack';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F9FAFB' },
      }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="create" />
      <Stack.Screen name="manage" />
    </Stack>
  );
}
