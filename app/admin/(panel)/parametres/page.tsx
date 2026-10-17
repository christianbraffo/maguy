import { getSettings } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export default async function ParametresPage() {
  const settings = await getSettings();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl sm:text-5xl">Paramètres</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
