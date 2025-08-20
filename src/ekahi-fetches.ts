import { FilterGroup } from "./queryFilters.js";

const EKAHI_API_URL = process.env.EKAHI_API_URL;
const CLOUD_FN_TOKEN = process.env.CLOUD_FN_TOKEN;

if (!EKAHI_API_URL || !CLOUD_FN_TOKEN) {
  throw new Error(
    "EKAHI_API_URL and CLOUD_FN_TOKEN environment variables must be set",
  );
}

interface Filter {
  field: string;
  operator: operator;
  value: string | number | boolean;
}

enum operator {
  EQUALS = "=",
  NOT_EQUALS = "!=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN_OR_EQUAL = "<=",
  IN = "IN",
  ARRAY_CONTAINS = "ARRAY_CONTAINS",
  ARRAY_CONTAINS_ANY = "ARRAY_CONTAINS_ANY",
}

const fetchEkahiUsers = async () => {
  try {
    const response = await fetch(`${EKAHI_API_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

const fetchEkahiUser = async (id: string) => {
  try {
    const response = await fetch(`${EKAHI_API_URL}/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

const fetchEkahiDeliverable = async (id: string) => {
  try {
    const response = await fetch(`${EKAHI_API_URL}/deliverables/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching deliverable with ID ${id}:`, error);
    return null;
  }
};

const fetchEkahiDeliverables = async () => {
  try {
    const response = await fetch(`${EKAHI_API_URL}/deliverables`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching deliverables:", error);
    return null;
  }
};

const fetchEkahiDeliverablesWithFilters = async (filters?: FilterGroup) => {
  try {
    let url = `${EKAHI_API_URL}/deliverables`;
    
    // If filters are provided, add them as query parameters
    if (filters) {
      const params = new URLSearchParams();
      params.append('filters', JSON.stringify(filters));
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching filtered deliverables:", error);
    return null;
  }
};

export {
  fetchEkahiUsers,
  fetchEkahiUser,
  fetchEkahiDeliverable,
  fetchEkahiDeliverables,
  fetchEkahiDeliverablesWithFilters,
};
