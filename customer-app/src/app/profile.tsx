import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#6C63FF', primaryLight: '#EEF0FF',
  text: '#1A1A2E', textLight: '#6B7280',
  background: '#F8F9FE', border: '#E5E7EB', error: '#EF4444',
};

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('Arjun Sharma');
  const [phone] = useState('+91 98765 43210');
  const [email] = useState('arjun.sharma@email.com');
  const [editing, setEditing] = useState(false);

  const MENU = [
    { icon: '📋', label: 'My Bookings', onPress: () => router.push('/my-bookings') },
    { icon: '📍', label: 'Saved Addresses', onPress: () => {} },
    { icon: '💳', label: 'Payment Methods', onPress: () => {} },
    { icon: '🔔', label: 'Notifications', onPress: () => {} },
    { icon: '🆘', label: 'Help & Support', onPress: () => {} },
    { icon: '⚙️', label: 'Settings', onPress: () => {} },
    { icon: '🚪', label: 'Logout', onPress: () => Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => router.replace('/login') },
    ]), danger: true },
  ];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{editing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>{name.charAt(0)}</Text>
          </View>
          {editing ? (
            <TextInput style={s.editInput} value={name} onChangeText={setName} placeholder="Full Name" />
          ) : (
            <>
              <Text style={s.name}>{name}</Text>
              <Text style={s.info}>📞 {phone}</Text>
              <Text style={s.info}>✉️ {email}</Text>
            </>
          )}
          <View style={s.statsRow}>
            <View style={s.stat}><Text style={s.statVal}>7</Text><Text style={s.statLabel}>Bookings</Text></View>
            <View style={s.statDiv} />
            <View style={s.stat}><Text style={s.statVal}>5</Text><Text style={s.statLabel}>Completed</Text></View>
            <View style={s.statDiv} />
            <View style={s.stat}><Text style={s.statVal}>4.6</Text><Text style={s.statLabel}>Avg Rating</Text></View>
          </View>
        </View>

        <View style={s.menuCard}>
          {MENU.map((item, idx) => (
            <React.Fragment key={idx}>
              <TouchableOpacity style={s.menuItem} onPress={item.onPress} activeOpacity={0.7}>
                <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
                <Text style={[s.menuLabel, item.danger && { color: COLORS.error }]}>{item.label}</Text>
                <Text style={{ color: COLORS.textLight, fontSize: 18 }}>›</Text>
              </TouchableOpacity>
              {idx < MENU.length - 1 && <View style={s.menuDiv} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={s.version}>Version 1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', flex: 1, marginLeft: 4 },
  profileCard: { backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarTxt: { fontSize: 34, fontWeight: '800', color: COLORS.primary },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  info: { fontSize: 13, color: COLORS.textLight, marginBottom: 3 },
  editInput: { width: '100%', backgroundColor: COLORS.background, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: COLORS.text, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, width: '100%', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  statDiv: { width: 1, height: 36, backgroundColor: COLORS.border },
  menuCard: { backgroundColor: '#fff', margin: 16, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  menuDiv: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textLight, marginBottom: 16 },
});
