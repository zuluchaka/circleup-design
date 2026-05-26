// Single-instance Snackbar primitive.
//
// Usage:
//   1. Wrap the app root in <SnackbarProvider /> (already done in _layout.tsx).
//   2. From any screen: const { showSnackbar } = useSnackbar();
//      showSnackbar({
//        message: "Plus cancelled — renews to Free on Jun 30.",
//        action: { label: "Undo", onPress: () => undo() },
//        duration: 10_000,
//        tone: "neutral",
//      });
//
// Behaviour:
// - One snackbar at a time. A new call replaces the current one.
// - Auto-dismisses after `duration` (default 4s; pass 0 to disable).
// - Sits above the AppTabs bottom bar with safe-area inset.
// - Tones: neutral (dark surface), success (emerald), danger (rose).
// - Action button uses an accent color matching the tone.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/shared/Text";
import { useTheme, space, radius, palette } from "@/theme";

export type SnackbarTone = "neutral" | "success" | "danger";

export type SnackbarOptions = {
  message: string;
  tone?: SnackbarTone;
  duration?: number; // ms; pass 0 to disable auto-dismiss
  action?: {
    label: string;
    onPress: () => void;
  };
  // Pixel offset from the bottom safe-area edge. Default sits above the
  // bottom tab bar (~84). For full-screen sub-routes that don't render
  // AppTabs, pass 24.
  bottomOffset?: number;
};

type SnackbarState = SnackbarOptions & { id: number };

type SnackbarContextValue = {
  showSnackbar: (opts: SnackbarOptions) => void;
  dismissSnackbar: () => void;
};

const SnackbarContext = createContext<SnackbarContextValue>({
  showSnackbar: () => {},
  dismissSnackbar: () => {},
});

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export function SnackbarProvider({
  children,
  // For screenshot variants only: seed the snackbar with an initial state so
  // the design tool can capture the snackbar layout without firing a real
  // toast. Production use should leave this undefined.
  initial,
}: {
  children: ReactNode;
  initial?: SnackbarOptions;
}) {
  const [state, setState] = useState<SnackbarState | null>(
    initial ? { ...initial, id: 0 } : null,
  );
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissSnackbar = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setState(null);
  }, []);

  const showSnackbar = useCallback((opts: SnackbarOptions) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    idRef.current += 1;
    const next: SnackbarState = { ...opts, id: idRef.current };
    setState(next);
    const duration = opts.duration ?? 4000;
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        setState((current) => (current?.id === next.id ? null : current));
      }, duration);
    }
  }, []);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const value = useMemo(() => ({ showSnackbar, dismissSnackbar }), [showSnackbar, dismissSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {state ? <SnackbarHost state={state} onDismiss={dismissSnackbar} /> : null}
    </SnackbarContext.Provider>
  );
}

function SnackbarHost({
  state,
  onDismiss,
}: {
  state: SnackbarState;
  onDismiss: () => void;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const bottomOffset = state.bottomOffset ?? 84;
  const translateY = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
    // Re-trigger on id change so a new toast slides in.
  }, [state.id, translateY, opacity]);

  const tone = state.tone ?? "neutral";
  const visual = TONE_VISUAL[tone];
  const bg = tone === "neutral" ? palette.slate[800] : visual.bg(t);
  const fg = "#fff";
  const actionFg = tone === "neutral" ? palette.amber[300] : visual.actionFg;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        { paddingBottom: insets.bottom + bottomOffset, paddingHorizontal: space.lg },
      ]}
    >
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: bg,
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <Text variant="bodySmall" weight="semibold" style={{ flex: 1, color: fg }} numberOfLines={2}>
          {state.message}
        </Text>
        {state.action ? (
          <Pressable
            onPress={() => {
              state.action!.onPress();
              onDismiss();
            }}
            style={styles.actionBtn}
          >
            <Text variant="bodySmall" weight="bold" style={{ color: actionFg, letterSpacing: 0.5 }}>
              {state.action.label.toUpperCase()}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

const TONE_VISUAL: Record<
  SnackbarTone,
  { bg: (t: ReturnType<typeof useTheme>) => string; actionFg: string }
> = {
  neutral: { bg: () => palette.slate[800], actionFg: palette.amber[300] },
  success: { bg: (t) => t.success, actionFg: "#fff" },
  danger: { bg: (t) => t.danger, actionFg: "#fff" },
};

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderRadius: radius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  actionBtn: {
    paddingHorizontal: space.sm,
    paddingVertical: 4,
  },
});
