import { FilterGroup } from "./queryFilters.js";
import { getResourceAgentResponse } from "./openai/agents/resource-agent.js";
const EKAHI_API_URL = process.env.EKAHI_API_URL;
const CLOUD_FN_TOKEN = process.env.CLOUD_FN_TOKEN;
import resourceCapabilities from "./resourceCapabilities.json";

if (!EKAHI_API_URL || !CLOUD_FN_TOKEN) {
  throw new Error(
    "EKAHI_API_URL and CLOUD_FN_TOKEN environment variables must be set",
  );
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
    let url = `${EKAHI_API_URL}/deliverables`;
    const params = new URLSearchParams();
    const resouceConfig = resourceCapabilities.deliverables;

    const joinFields = resouceConfig?.refFields || [];

    joinFields.forEach((field) => {
      params.append("join", field);
    });

    if (params.toString()) {
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
    console.error("Error fetching deliverables:", error);
    return null;
  }
};

// TODO: this is more of a maybe it will work idk sttil need to get the NLP to work
const fetchComposeQueryFetch = async (
  naturalLanguageQuery: string,
  resource: string,
) => {
  try {
    // const resourceAgent = getResourceAgentResponse(naturalLanguageQuery);
    //
    // if (!resourceAgent) {
    //   throw new Error("Resource agent response is null or undefined");
    // }
    //   const response = await fetch(`${EKAHI_API_URL}/query/compose`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
    //     },
    //     body: JSON.stringify({
    //       resource: resource,
    //       input: {
    //         naturalLanguage: naturalLanguageQuery,
    //       },
    //       config: {
    //         mode: "fetch",
    //       },
    //     }),
    //   });
    //
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //
    //   const data = await response.json();
    //   console.dir(data, { depth: null });
    //   return data.data;
  } catch (error) {
    console.error("Error fetching compose query:", error);
    return null;
  }
};

const fetchEkahiDeliverablesWithFilters = async (
  filters?: FilterGroup,
  join?: string[],
) => {
  console.log("Fetching Ekahi deliverables with filters:", filters, join);
  try {
    let url = `${EKAHI_API_URL}/deliverables`;
    const params = new URLSearchParams();

    // Add filters if provided
    if (filters) {
      params.append("filter", JSON.stringify(filters));
    }

    // Add joins to populate document references
    if (join && join.length > 0) {
      join.forEach((j) => params.append("join", j));
    } else {
      // Default joins for common document references
      const defaultJoins = ["accountableOu", "createdBy", "assignedTo"];
      defaultJoins.forEach((join) => params.append("join", join));
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("Fetching Ekahi deliverables with filters:", url);

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
  fetchComposeQueryFetch,
};
