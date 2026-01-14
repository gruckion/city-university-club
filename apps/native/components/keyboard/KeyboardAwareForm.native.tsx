import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

interface KeyboardAwareFormProps {
  children: ReactNode;
  bottomOffset?: number;
}

export function KeyboardAwareForm({
  children,
  bottomOffset = 62,
}: KeyboardAwareFormProps) {
  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={bottomOffset}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </>
  );
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
