import React, { useState } from "react";
import { Section, SettingsPage, ToggleRow } from "./SettingsDetailScreens";

export function NotificationsScreen() {
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [marketNews, setMarketNews] = useState(true);
  const [portfolio, setPortfolio] = useState(false);
  return (
    <SettingsPage
      title="Notifications"
      subtitle="Choose the updates you receive"
    >
      <Section title="Preferences">
        <ToggleRow
          title="Price alerts"
          subtitle="Large moves in watched assets"
          value={priceAlerts}
          onChange={setPriceAlerts}
        />
        <ToggleRow
          title="Market news"
          subtitle="Important market headlines"
          value={marketNews}
          onChange={setMarketNews}
        />
        <ToggleRow
          title="Portfolio summary"
          subtitle="Weekly performance overview"
          value={portfolio}
          onChange={setPortfolio}
        />
      </Section>
    </SettingsPage>
  );
}
