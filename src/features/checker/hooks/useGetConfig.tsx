import { useState, useEffect } from "react";
import { API, getEndpoint } from "@/core/constant/apis";

type ConfigType = "purpose_type" | "transaction_type" | "document_type";

interface ConfigData {
  success: boolean;
  data: any[];
  message: string;
}

interface ConfigResponse {
  [key: string]: {
    data: any[] | null;
    loading: boolean;
    error: string | null;
  };
}

// Use the backend proxy API endpoint instead of directly accessing the external API
const GET_CONFIG_API = API.CONFIG.GET_CONFIG;

export const useGetConfig = (
  types: ConfigType[] = ["purpose_type", "transaction_type", "document_type"]
) => {
  const [configData, setConfigData] = useState<ConfigResponse>(() =>
    types.reduce((acc, type) => {
      acc[type] = { data: null, loading: true, error: null };
      return acc;
    }, {} as ConfigResponse)
  );

  useEffect(() => {
    const fetchConfig = async (type: ConfigType) => {
      try {
        const response = await fetch(`https://nium.thestorywallcafe.com/v1/api/config?type=${type}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            api_key: "7b4d9b49-1794-4a91-826a-749cf0d8a87a",
            partner_id: "befb8eadb0fac508d695b7395ec10543m8ctxoh9",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: ConfigData = await response.json();

        setConfigData((prev) => ({
          ...prev,
          [type]: {
            data: data.success ? data.data : null,
            loading: false,
            error: data.success ? null : data.message,
          },
        }));
      } catch (error) {
        console.error("Fetch error:", error);
        setConfigData((prev) => ({
          ...prev,
          [type]: { data: null, loading: false, error: (error as Error).message },
        }));
      }
    };

    types.forEach((type) => fetchConfig(type));
  }, [JSON.stringify(types)]); // Re-run if types array changes

  return configData;
};

export default useGetConfig;
