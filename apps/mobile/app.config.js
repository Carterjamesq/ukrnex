const appJson = require("./app.json");

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  ...appJson.expo,
  extra: {
    ...appJson.expo.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001",
  },
};
