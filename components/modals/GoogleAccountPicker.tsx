import { BorderRadius, Colors, Spacing, Typography } from "@/constants";
import { MOCK_GOOGLE_ACCOUNTS, MockGoogleAccount } from "@/mocks/auth.mock";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface GoogleAccountPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectAccount: (account: MockGoogleAccount) => void;
}

export function GoogleAccountPicker({
  visible,
  onClose,
  onSelectAccount,
}: GoogleAccountPickerProps) {
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (account: MockGoogleAccount) => {
    setSelectedId(account.id);
    setLoading(true);

    // Симулируем задержку авторизации (как настоящая Google auth)
    setTimeout(() => {
      onSelectAccount(account);
      setLoading(false);
      setSelectedId(null);
    }, 1000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.googleLogo}>
              <Text style={styles.googleText}>G</Text>
            </View>
            <Text style={styles.title}>Выберите аккаунт</Text>
            <Text style={styles.subtitle}>для входа в Korean Learning App</Text>
          </View>

          {/* Account List */}
          <View style={styles.accountList}>
            {MOCK_GOOGLE_ACCOUNTS.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={styles.accountItem}
                onPress={() => handleSelect(account)}
                disabled={loading}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>{account.picture}</Text>
                </View>

                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountEmail}>{account.email}</Text>
                </View>

                {loading && selectedId === account.id && (
                  <ActivityIndicator size="small" color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Отмена</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimer}>
            Это демо-версия. В продакшене будет настоящая Google авторизация.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    maxHeight: "80%",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  googleLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  googleText: {
    fontSize: 28,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  accountList: {
    paddingHorizontal: Spacing.lg,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  accountEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    padding: Spacing.md,
    alignItems: "center",
  },
  cancelText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
  },
  disclaimer: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    textAlign: "center",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
});
