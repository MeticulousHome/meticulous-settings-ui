import { useCallback, useEffect, useState } from "react";
import {
  BooleanField,
  DragDropList,
  NumberField,
  ObjectEditor,
  StringField,
} from "../components/Settings";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";
import { useProfiles } from "../hooks/useProfiles";

export const SettingsEditor = () => {
  const { data: settings, isLoading, error } = useSettings();
  const { data: profiles } = useProfiles();
  const mutation = useUpdateSettings();

  const [localSettings, setLocalSettings] = useState<any>({});

  const getProfileName = useCallback(
    (profileId: string) => {
      if (!profiles) return profileId;
      const profile = profiles.find((p: any) => p.id === profileId);
      return profile ? profile.name : profileId;
    },
    [profiles]
  );

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setLocalSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    mutation.mutate(localSettings);
  };
  if (isLoading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">Error loading settings</div>
    );

  return (
    <main className="container py-4">
      <h1 className="mb-4">Settings Editor</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {Object.entries(localSettings).map(([key, value]) => {
          if (key === "profile_order" && Array.isArray(value)) {
            return (
              <DragDropList
                key={key}
                value={value.map((profileId: string) => ({
                  key: profileId,
                  value: getProfileName(profileId),
                }))}
                onChange={(v) =>
                  handleChange(
                    key,
                    v.map((item: any) => item.key)
                  )
                }
                title={"Profile Order"}
              />
            );
          } else if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            return (
              <ObjectEditor
                key={key}
                obj_val={value}
                onChange={(v) => handleChange(key, v)}
                title={key}
              />
            );
          } else if (Array.isArray(value)) {
            return (
              <DragDropList
                key={key}
                value={value}
                onChange={(v) => handleChange(key, v)}
                title={key}
              />
            );
          } else if (typeof value === "boolean") {
            return (
              <BooleanField
                key={key}
                label={key}
                value={value}
                onChange={(v) => handleChange(key, v)}
              />
            );
          } else if (typeof value === "string") {
            return (
              <StringField
                key={key}
                label={key}
                value={value}
                onChange={(v) => handleChange(key, v)}
              />
            );
          } else if (typeof value === "number") {
            return (
              <NumberField
                key={key}
                label={key}
                value={value}
                onChange={(v) => handleChange(key, v)}
              />
            );
          } else {
            return null;
          }
        })}
        <button type="submit" className="btn btn-primary mt-3">
          {mutation.isError
            ? `Failed to save: ${mutation.error}`
            : mutation.isPending
            ? "Saving..."
            : mutation.isSuccess
            ? "Saved"
            : "Save Settings"}
        </button>
      </form>
    </main>
  );
};
