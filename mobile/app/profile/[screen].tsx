import { useLocalSearchParams, Stack } from "expo-router";
import { View } from "react-native";
import { ProfileHub } from "@/components/sections/screens/ProfileHub";
import { ProfilePersonalInfo } from "@/components/sections/screens/ProfilePersonalInfo";
import { ProfileIdentity } from "@/components/sections/screens/ProfileIdentity";
import { ProfilePaymentMethods } from "@/components/sections/screens/ProfilePaymentMethods";
import { ProfileSecurity } from "@/components/sections/screens/ProfileSecurity";
import { ProfileNotifications } from "@/components/sections/screens/ProfileNotifications";
import { ProfileLanguage } from "@/components/sections/screens/ProfileLanguage";
import { ProfileSubscription } from "@/components/sections/screens/ProfileSubscription";
import { ProfileHelp } from "@/components/sections/screens/ProfileHelp";
import { ProfileLegalAbout } from "@/components/sections/screens/ProfileLegalAbout";
import { Text } from "@/components/shared/Text";
import { useTheme, space } from "@/theme";
import {
  identityBasicData,
  identityRejectedData,
  paymentMethodsEmptyData,
  subscriptionPastDueData,
  subscriptionTrialData,
  subscriptionCancelsSoonData,
  subscriptionCancelledData,
} from "@/product/sections/20-profile/variants";

const ROUTES = {
  "personal-info": ProfilePersonalInfo,
  identity: ProfileIdentity,
  "payment-methods": ProfilePaymentMethods,
  security: ProfileSecurity,
  notifications: ProfileNotifications,
  language: ProfileLanguage,
  subscription: ProfileSubscription,
  help: ProfileHelp,
  "legal-about": ProfileLegalAbout,
  "identity-basic": () => <ProfileIdentity data={identityBasicData} />,
  "identity-rejected": () => <ProfileIdentity data={identityRejectedData} />,
  "payment-methods-empty": () => <ProfilePaymentMethods data={paymentMethodsEmptyData} />,
  "subscription-past-due": () => <ProfileSubscription data={subscriptionPastDueData} />,
  "subscription-trial": () => <ProfileSubscription data={subscriptionTrialData} />,
  "subscription-cancels-soon": () => <ProfileSubscription data={subscriptionCancelsSoonData} initialConfirm={false} />,
  "subscription-cancelled": () => <ProfileSubscription data={subscriptionCancelledData} />,
  "subscription-confirm-cancel": () => <ProfileSubscription initialConfirm={true} />,
  "security-confirm-sign-out-all": () => <ProfileSecurity initialConfirm="sign-out-all" />,
  "security-confirm-delete": () => <ProfileSecurity initialConfirm="delete-account" />,
  "personal-info-photo-sheet": () => <ProfilePersonalInfo initialPhotoSheet={true} />,
  "hub-confirm-sign-out": () => <ProfileHub initialConfirm={true} />,
  "hub-past-due": () => <ProfileHub data={subscriptionPastDueData} />,
  "notifications-dirty": () => <ProfileNotifications initialDirty={true} />,
  "hub-association-switcher": () => <ProfileHub initialSwitcherOpen={true} />,
  "subscription-cancel-snackbar": () => <ProfileSubscription initialCancelSnackbar={true} />,
} as const;

export default function ProfileSubScreen() {
  const { screen } = useLocalSearchParams<{ screen: string }>();
  const Renderer = ROUTES[screen as keyof typeof ROUTES];
  const t = useTheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {Renderer ? (
        <Renderer />
      ) : (
        <View style={{ flex: 1, backgroundColor: t.bg, padding: space.lg, justifyContent: "center" }}>
          <Text variant="h2" weight="bold" align="center">
            Unknown profile screen
          </Text>
          <Text variant="bodySmall" tone="secondary" align="center" style={{ marginTop: space.sm }}>
            "{String(screen)}" doesn't map to a known sub-route.
          </Text>
        </View>
      )}
    </>
  );
}
