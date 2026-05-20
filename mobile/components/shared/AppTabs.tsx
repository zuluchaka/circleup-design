import { router, usePathname } from "expo-router";
import {
  Compass,
  Building2,
  CircleDot,
  User as UserIcon,
  Briefcase,
} from "lucide-react-native";
import { BottomTabBar } from "./BottomTabBar";
import { CURRENT_USER } from "@/data/currentUser";

const BASE_TABS = {
  discover: { key: "discover", label: "Discover", icon: Compass, route: "/" },
  relationships: {
    key: "relationships",
    label: "Relationships",
    icon: Briefcase,
    route: "/business-relationships",
  },
  associations: {
    key: "associations",
    label: "Associations",
    icon: Building2,
    route: "/associations",
  },
  circles: { key: "circles", label: "Circles", icon: CircleDot, route: "/circles" },
  profile: { key: "profile", label: "Profile", icon: UserIcon, route: "/profile" },
} as const;

// CMs see Relationships before Associations. Members see the standard 4 tabs.
const TABS = CURRENT_USER.isCircleManager
  ? ([
      BASE_TABS.discover,
      BASE_TABS.relationships,
      BASE_TABS.associations,
      BASE_TABS.circles,
      BASE_TABS.profile,
    ] as const)
  : ([
      BASE_TABS.discover,
      BASE_TABS.associations,
      BASE_TABS.circles,
      BASE_TABS.profile,
    ] as const);

type TabKey = (typeof TABS)[number]["key"];

function activeFromPath(pathname: string): TabKey {
  if (pathname.startsWith("/business-relationships")) return "relationships" as TabKey;
  if (pathname.startsWith("/associations")) return "associations" as TabKey;
  if (pathname.startsWith("/circles")) return "circles" as TabKey;
  if (pathname.startsWith("/profile")) return "profile" as TabKey;
  return "discover" as TabKey;
}

export function AppTabs() {
  const pathname = usePathname();
  const active = activeFromPath(pathname);
  return (
    <BottomTabBar
      tabs={TABS}
      active={active}
      onChange={(key) => {
        const target = TABS.find((t) => t.key === key);
        if (target) router.replace(target.route as never);
      }}
    />
  );
}
