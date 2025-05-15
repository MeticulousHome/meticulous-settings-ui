import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.REACT_APP_API_URL || "";

// API fetch
export const fetchSettings = async () => {
  const res = await fetch(API_URL+"/api/v1/settings");
  if (!res.ok) throw new Error("Failed to fetch settings");
  if (res.status !== 200)throw new Error(`Server returned ${res.status}`);
  return res.json();
};

export const updateSettings = async (newSettings: any) => {
  const res = await fetch(API_URL+"/api/v1/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSettings),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
};

export const useSettings = () => {
    return useQuery({
        queryKey: ["settings"],
        queryFn: fetchSettings,
        refetchInterval: 2000,
    });
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSettings,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
    });
};