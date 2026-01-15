import { StyleSheet, Text, View } from "react-native";

import { Button } from "./Button";

export interface HeaderProps {
  user?: { name: string };
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
}

export const Header = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
}: HeaderProps) => (
  <View>
    <View style={styles.wrapper}>
      <View style={styles.logoContainer}>
        <Text style={styles.h1}>Acme</Text>
      </View>
      <View style={styles.buttonContainer}>
        {user ? (
          <>
            <Text>Welcome, </Text>
            <Text style={styles.userName}>{user.name}!</Text>

            <Button
              label="Log out"
              onPress={onLogout}
              size="small"
              style={styles.button}
            />
          </>
        ) : (
          <>
            <Button
              label="Log in"
              onPress={onLogin}
              size="small"
              style={styles.button}
            />

            <Button
              label="Sign up"
              onPress={onCreateAccount}
              primary
              size="small"
              style={styles.button}
            />
          </>
        )}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  h1: {
    fontWeight: "900",
    fontSize: 20,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 10,
    color: "black",
    alignSelf: "flex-start",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontWeight: "700",
  },
});
