import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
  useKeyboardState,
} from "react-native-keyboard-controller";

interface KeyboardAwareFormProps {
  children: ReactNode;
  bottomOffset?: number;
}

export function KeyboardAwareForm({
  children,
  bottomOffset = 62,
}: KeyboardAwareFormProps) {
  // Only show toolbar when keyboard is actually visible
  const isKeyboardVisible = useKeyboardState((state) => state.isVisible);

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={bottomOffset}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </KeyboardAwareScrollView>
      {isKeyboardVisible && <KeyboardToolbar />}
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
