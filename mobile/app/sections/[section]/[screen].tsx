import { useLocalSearchParams, Stack } from "expo-router";
import { screenManifest } from "@/components/sections/manifest";
import { sectionsCatalog } from "@/data/sectionsCatalog";
import { ScreenStub } from "@/components/sections/Stub";

export default function SectionScreen() {
  const { section, screen } = useLocalSearchParams<{ section: string; screen: string }>();
  const meta = sectionsCatalog.find((s) => s.slug === section);
  const screenMeta = meta?.screens.find((sc) => sc.slug === screen);
  const Renderer = screenManifest[`${section}/${screen}` as keyof typeof screenManifest];

  return (
    <>
      <Stack.Screen
        options={{
          title: screenMeta?.label ?? "Screen",
          headerShown: false,
        }}
      />
      {Renderer ? (
        <Renderer />
      ) : (
        <ScreenStub
          sectionTitle={meta?.title ?? "Section"}
          screenLabel={screenMeta?.label ?? "Screen"}
          sectionIndex={meta?.index ?? 0}
        />
      )}
    </>
  );
}
