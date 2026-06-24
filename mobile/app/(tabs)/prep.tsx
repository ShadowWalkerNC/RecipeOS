import { View, Text, ActivityIndicator, StyleSheet, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePrepLists, useTogglePrepTask } from '../../lib/queries';
import { PrepTaskRow } from '../../components/PrepTaskRow';

export default function PrepScreen() {
  const { data: lists, isLoading, error } = usePrepLists();
  const toggleTask = useTogglePrepTask();

  if (isLoading) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.title}>Prep List</Text></View>
      <View style={styles.center}><ActivityIndicator color="#16a34a" /></View>
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.title}>Prep List</Text></View>
      <View style={styles.center}><Text style={styles.errorText}>Failed to load prep lists.</Text></View>
    </SafeAreaView>
  );

  const sections = (lists ?? []).map((list) => ({
    title: list.name,
    data: (list.tasks ?? []).sort((a, b) => a.sort_order - b.sort_order),
    doneCount: (list.tasks ?? []).filter((t) => t.is_done).length,
    totalCount: (list.tasks ?? []).length,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}><Text style={styles.title}>Prep List</Text></View>
      {sections.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>\uD83D\uDCCB</Text>
          <Text style={styles.emptyTitle}>No prep lists</Text>
          <Text style={styles.emptyBody}>Prep lists will appear here once created.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(task) => task.id}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionProgress}>{section.doneCount}/{section.totalCount}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <PrepTaskRow task={item} onToggle={(id, is_done) => toggleTask.mutate({ id, is_done })} />
          )}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { color: '#ef4444' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyBody: { color: '#888', fontSize: 13, textAlign: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginTop: 8, borderBottomWidth: 1, borderBottomColor: '#222' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sectionProgress: { color: '#16a34a', fontSize: 13, fontWeight: '600' },
});
