import { Button } from "@/components/ui/button";
import steamLogo from "@/assets/steam-logo.svg";
import epicGamesLogo from "@/assets/epic-games-logo.svg";
import gogLogo from "@/assets/gog-logo.svg";
import microsoftLogo from "@/assets/microsoft-logo.svg";
import playstationLogo from "@/assets/playstation-logo.svg";
import xboxLogo from "@/assets/xbox-logo.svg";
import nintendoLogo from "@/assets/nintendo-logo.svg";
import googlePlayLogo from "@/assets/google-play-logo.svg";
import appStoreLogo from "@/assets/apple-logo.svg";
import shoppingCartLogo from "@/assets/shopping-cart-logo.svg";

const getStoreInfo = (url) => {
  if (url.includes("store.steampowered.com")) {
    return {
      logo: steamLogo,
      name: "Steam",
    };
  }
  if (url.includes("epicgames.com")) {
    return {
      logo: epicGamesLogo,
      name: "Epic Games",
      invertInDark: true,
    };
  }
  if (url.includes("gog.com")) {
    return {
      logo: gogLogo,
      name: "GOG",
    };
  }
  if (url.includes("microsoft.com")) {
    return {
      logo: microsoftLogo,
      name: "Microsoft",
    };
  }
  if (url.includes("playstation.com")) {
    return {
      logo: playstationLogo,
      name: "PlayStation",
      invertInDark: true,
    };
  }
  if (url.includes("xbox.com")) {
    return {
      logo: xboxLogo,
      name: "Xbox",
    };
  }
  if (url.includes("nintendo.com")) {
    return {
      logo: nintendoLogo,
      name: "Nintendo",
    };
  }
  if (url.includes("play.google.com")) {
    return {
      logo: googlePlayLogo,
      name: "Google Play",
    };
  }
  if (url.includes("apps.apple.com")) {
    return {
      logo: appStoreLogo,
      name: "App Store",
      invertInDark: true,
    };
  }
  return {
    logo: shoppingCartLogo,
    name: "Store",
    invertInDark: true,
  };
};

export const StoreLink = ({ url }) => {
  const storeInfo = getStoreInfo(url);

  return (
    <Button variant="outline" className="gap-2" asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {storeInfo.logo && (
          <img
            src={storeInfo.logo}
            alt={storeInfo.name}
            className={`h-5 w-5 ${storeInfo.invertInDark ? "dark:invert" : ""}`}
          />
        )}
        {storeInfo.name}
      </a>
    </Button>
  );
};
