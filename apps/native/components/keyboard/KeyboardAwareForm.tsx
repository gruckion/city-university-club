import type { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";

interface KeyboardAwareFormProps {
  children: ReactNode;
  bottomOffset?: number;
}

export function KeyboardAwareForm({
  children,
  bottomOffset: _bottomOffset, // Unused on web
}: KeyboardAwareFormProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
  // No KeyboardToolbar on web - browsers handle keyboard natively
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    gap: 16,
  },
});
