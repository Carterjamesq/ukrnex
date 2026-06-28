import { Tabs } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "@/constants/theme";

function TabIcon({
  name,
  focused,
  icon,
}: {
  name: string;
  focused: boolean;
  icon?: "estimate" | "history" | "profile";
}) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      {icon === "estimate" ? (
        <Text style={[styles.estimateIcon, focused && styles.tabLabelActive]}>
          $
        </Text>
      ) : icon === "history" ? (
        <Image
          source={require("@/assets/images/history-icon.png")}
          style={styles.iconImage}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={require("@/assets/images/profile-icon.png")}
          style={styles.iconImage}
          resizeMode="contain"
        />
      )}
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {name}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Оцінка",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Оцінка" focused={focused} icon="estimate" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Історія",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Історія" focused={focused} icon="history" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профіль",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="Профіль" focused={focused} icon="profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 81,
    paddingTop: 9,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.white,
  },
  tabItem: {
    flex: 1,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  tabItemActive: {
    backgroundColor: colors.navActiveBg,
  },
  estimateIcon: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textNav,
    lineHeight: 20,
  },
  iconImage: {
    width: 18,
    height: 18,
  },
  tabLabel: {
    ...typography.navLabel,
    color: colors.textNav,
  },
  tabLabelActive: {
    color: colors.link,
  },
});
