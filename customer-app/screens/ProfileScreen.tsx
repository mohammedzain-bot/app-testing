import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, StatusBar, Alert,
} from 'react-native';
import { COLORS } from '../constants';

export default function ProfileScreen({ navigation }: any) {
  const [name, setName] = useState('Arjun Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('arjun.sharma@email.com');
  const [editing, setEditing] = useState(false);

  const MENU_ITEMS = [
    { icon: '📋', label: 'My Bookings', onPress: () => navigation.navigate('MyBookings') },
    { icon: '📍', label: 'Saved Addresses', onPress: () => {} },
    { icon: '💳', label: 'Payment Methods', onPress: () => {} },
    { icon: '🔔', label: 'Notifications', onPress: () => navigation.navigate('Notifications') },
    { icon: '🆘', label: 'Help & Support', onPress: () => {} },
    { icon: '⚙️', label: 'Settings', onPress: () => {} },
    { icon: '🚪', label: 'Logout', onPress: () => Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => navigation.replace('Login') },
    ]), danger: true },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{editing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
          {editing ? (
            <>
              <TextInput style={styles.editInput} value={name} onChangeText={setName} placeholder="Full Name" />
              <TextInput style={styles.editInput} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
              <TextInput style={styles.editInput} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
            </>
          ) : (
            <>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.info}>📞 {phone}</Text>
              <Text style={styles.info}>✉️ {email}</Text>
            </>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>7</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>5</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>4.6</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, idx) => (
            <React.Fragment key={idx}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
                <Text style={{ fontSize: 22, marginRight: 14 }}>{item.icon}</Text>
                <Text style={[styles.menuLabel, item.danger && { color: COLORS.error }]}>{item.label}</Text>
                <Text style={{ color: COLORS.textLight, fontSize: 18 }}>›</Text>
              </TouchableOpacity>
              {idx < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  profileCard: {
    backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: COLORS.primary },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  info: { fontSize: 13, color: COLORS.textLight, marginBottom: 3 },
  editInput: {
    width: '100%', backgroundColor: COLORS.background, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: COLORS.text,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, width: '100%', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  statDiv: { width: 1, height: 36, backgroundColor: COLORS.border },
  menuCard: {
    backgroundColor: '#fff', margin: 16, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
  menuDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textLight, marginBottom: 16 },
});
