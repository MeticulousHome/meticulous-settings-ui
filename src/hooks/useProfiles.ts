import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../api";

const fetchProfiles = async () => {
  const res = await fetch(API_URL+"/api/v1/profile/list?full=false");
  if (!res.ok) throw new Error("Failed to fetch settings");
  if (res.status !== 200)throw new Error(`Server returned ${res.status}`);
  return res.json();
};


export const useProfiles = () => {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: fetchProfiles,
    });
};