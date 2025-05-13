// utils/googleAuth.ts
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  return Google.useAuthRequest({
    iosClientId: "<IOS_CLIENT_ID>",
    androidClientId: "<ANDROID_CLIENT_ID>",
    expoClientId: "<EXPO_CLIENT_ID>",
  });
};
