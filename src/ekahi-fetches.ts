import { FilterGroup } from "./queryFilters.js";
import { getResourceAgentResponse } from "./openai/agents/resource-agent.js";
const EKAHI_API_URL = process.env.EKAHI_API_URL;
const CLOUD_FN_TOKEN = process.env.CLOUD_FN_TOKEN;
import resourceCapabilities from "./resourceCapabilities.json" with { type: "json" };

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

    const response_1 = await response.json();
    const data = response_1.data || response_1;
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

    const response_1 = await response.json();
    const data = response_1.data || response_1;
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
    const response_1 = await response.json();
    const data = response_1.data || response_1;
    return data;
  } catch (error) {
    console.error(`Error fetching deliverable with ID ${id}:`, error);
    return null;
  }
};

const fetchEkahiDeliverables = async () => {
  try {
    console.log("=== FETCH DELIVERABLES DEBUG ===");
    let url = `${EKAHI_API_URL}/deliverables`;
    const params = new URLSearchParams();
    const resouceConfig = resourceCapabilities.deliverables;

    const joinFields = resouceConfig?.refFields || [];
    console.log("Available ref fields:", joinFields);

    if (joinFields.length > 0) {
      params.append("join", joinFields.join(","));
    }

    // Add reasonable limit
    params.append("limit", "50");

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log("Final URL:", url);
    console.log("Making request to API...");

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response body:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`,
      );
    }

    const responseText = await response.text();
    console.log("Raw response length:", responseText.length);
    console.log(
      "Raw response preview:",
      responseText.substring(0, 200) + "...",
    );

    try {
      const response_1 = JSON.parse(responseText);
      console.log("Response structure:", Object.keys(response_1));

      // Extract deliverables from the data property
      const deliverables = response_1.data || response_1;

      console.log("Deliverables received:", deliverables?.length, "items");
      console.log(
        "Sample deliverable keys:",
        deliverables?.[0] ? Object.keys(deliverables[0]) : "No data",
      );
      console.log("Sample accountableOu:", deliverables?.[0]?.accountableOu);
      console.log("=== END FETCH DEBUG ===");
      return deliverables;
    } catch (parseError) {
      console.log("JSON parse error:", parseError);
      console.log("Full raw response:", responseText);
      throw parseError;
    }
  } catch (error) {
    console.error("Error fetching deliverables:", error);
    return null;
  }
};

// TODO: this is more of a maybe it will work idk sttil need to get the NLP to work
// const fetchComposeQueryFetch = async (
//   naturalLanguageQuery: string,
//   resource: string,
// ) => {
//   try {
//     // const resourceAgent = getResourceAgentResponse(naturalLanguageQuery);
//     //
//     // if (!resourceAgent) {
//     //   throw new Error("Resource agent response is null or undefined");
//     // }
//     //   const response = await fetch(`${EKAHI_API_URL}/query/compose`, {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
//     //     },
//     //     body: JSON.stringify({
//     //       resource: resource,
//     //       input: {
//     //         naturalLanguage: naturalLanguageQuery,
//     //       },
//     //       config: {
//     //         mode: "fetch",
//     //       },
//     //     }),
//     //   });
//     //
//     //   if (!response.ok) {
//     //     throw new Error(`HTTP error! status: ${response.status}`);
//     //   }
//     //
//     //   const data = await response.json();
//     //   console.dir(data, { depth: null });
//     //   return data.data;
//   } catch (error) {
//     console.error("Error fetching compose query:", error);
//     return null;
//   }
// };

const fetchEkahiDeliverablesWithFilters = async (
  filters?: FilterGroup,
  join?: string[],
) => {
  try {
    let url = `${EKAHI_API_URL}/deliverables`;
    const params = new URLSearchParams();

    // Add filters if provided
    if (filters) {
      params.append("filter", JSON.stringify(filters));
    }

    // Add joins to populate document references (only if specifically requested)
    if (join && join.length > 0) {
      params.append("join", join.join(","));
    }

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
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const response_1 = await response.json();
    const data = response_1.data || response_1;

    return data;
  } catch (error) {
    console.error("Error fetching filtered deliverables:", error);
    return null;
  }
};

const fetchOuByName = async (searchValue: string) => {
  try {
    console.log("=== FETCHING OU BY NAME ===");
    console.log("Searching for OU:", searchValue);

    const url = `${EKAHI_API_URL}/ous?query=${encodeURIComponent(searchValue)}&limit=10`;
    console.log("OU search URL:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const response_1 = await response.json();
    const ous = response_1.data || response_1;

    console.log("Found OUs:", ous?.length);
    console.log("Sample OU:", ous?.[0]);
    console.log("=== END OU FETCH ===");

    return ous;
  } catch (error) {
    console.error("Error fetching OUs:", error);
    return null;
  }
};

const fetchDeliverableByName = async (deliverableName: string) => {
  try {
    const url = `${EKAHI_API_URL}/deliverables?query=${encodeURIComponent(deliverableName)}&limit=5`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const response_1 = await response.json();
    const deliverables = response_1.data || response_1;

    return deliverables;
  } catch (error) {
    console.error("Error fetching deliverable by name:", error);
    return null;
  }
};

const fetchUserByName = async (userName: string) => {
  try {
    const url = `${EKAHI_API_URL}/users?query=${encodeURIComponent(userName)}&limit=10`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const response_1 = await response.json();
    const users = response_1.data || response_1;

    return users;
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return null;
  }
};

const fetchByP3Name = async (p3Name: string) => {
  try {
    const url = `${EKAHI_API_URL}/p3-entities?query=${encodeURIComponent(p3Name)}&limit=10`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const response_1 = await response.json();
    const users = response_1.data || response_1;

    return users;
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return null;
  }
};

const fetchDeliverableIssues = async (deliverableId: string) => {
  try {
    const url = `${EKAHI_API_URL}/issues?filter=${encodeURIComponent(JSON.stringify({
      logicalOperator: "AND",
      conditions: [
        {
          field: "deliverable",
          operator: "=",
          value: deliverableId
        }
      ]
    }))}&limit=50`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const response_1 = await response.json();
    const issues = response_1.data || response_1;

    return issues;
  } catch (error) {
    console.error(`Error fetching issues for deliverable ${deliverableId}:`, error);
    return null;
  }
};

const fetchDeliverableTasks = async (deliverableId: string) => {
  try {
    const url = `${EKAHI_API_URL}/tasks?filter=${encodeURIComponent(JSON.stringify({
      logicalOperator: "AND",
      conditions: [
        {
          field: "deliverable",
          operator: "=",
          value: deliverableId
        }
      ]
    }))}&limit=50`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const response_1 = await response.json();
    const tasks = response_1.data || response_1;

    return tasks;
  } catch (error) {
    console.error(`Error fetching tasks for deliverable ${deliverableId}:`, error);
    return null;
  }
};

const fetchEkahiIssue = async (idOrName: string) => {
  try {
    // Check if it looks like an ID (assuming IDs are alphanumeric without spaces)
    const isId = /^[a-zA-Z0-9_-]+$/.test(idOrName) && !idOrName.includes(' ');
    
    let url: string;
    if (isId) {
      // Try as ID first
      url = `${EKAHI_API_URL}/issues/${idOrName}`;
    } else {
      // Use as search query
      url = `${EKAHI_API_URL}/issues?query=${encodeURIComponent(idOrName)}&limit=1`;
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      // If ID lookup failed, try as name search
      if (isId) {
        console.log(`ID lookup failed for ${idOrName}, trying as name search...`);
        const searchUrl = `${EKAHI_API_URL}/issues?query=${encodeURIComponent(idOrName)}&limit=1`;
        const searchResponse = await fetch(searchUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
          },
        });
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const issues = searchData.data || searchData;
          return issues && issues.length > 0 ? issues[0] : null;
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const response_1 = await response.json();
    if (isId) {
      return response_1.data || response_1;
    } else {
      // For search results, return the first match
      const issues = response_1.data || response_1;
      return issues && issues.length > 0 ? issues[0] : null;
    }
  } catch (error) {
    console.error(`Error fetching issue with ID/name ${idOrName}:`, error);
    return null;
  }
};

const fetchEkahiTask = async (idOrName: string) => {
  try {
    // Check if it looks like an ID (assuming IDs are alphanumeric without spaces)
    const isId = /^[a-zA-Z0-9_-]+$/.test(idOrName) && !idOrName.includes(' ');
    
    let url: string;
    if (isId) {
      // Try as ID first
      url = `${EKAHI_API_URL}/tasks/${idOrName}`;
    } else {
      // Use as search query
      url = `${EKAHI_API_URL}/tasks?query=${encodeURIComponent(idOrName)}&limit=1`;
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
      },
    });

    if (!response.ok) {
      // If ID lookup failed, try as name search
      if (isId) {
        console.log(`ID lookup failed for ${idOrName}, trying as name search...`);
        const searchUrl = `${EKAHI_API_URL}/tasks?query=${encodeURIComponent(idOrName)}&limit=1`;
        const searchResponse = await fetch(searchUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${CLOUD_FN_TOKEN}`,
          },
        });
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          const tasks = searchData.data || searchData;
          return tasks && tasks.length > 0 ? tasks[0] : null;
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const response_1 = await response.json();
    if (isId) {
      return response_1.data || response_1;
    } else {
      // For search results, return the first match
      const tasks = response_1.data || response_1;
      return tasks && tasks.length > 0 ? tasks[0] : null;
    }
  } catch (error) {
    console.error(`Error fetching task with ID/name ${idOrName}:`, error);
    return null;
  }
};

export {
  fetchEkahiUsers,
  fetchEkahiUser,
  fetchEkahiDeliverable,
  fetchEkahiDeliverables,
  fetchEkahiDeliverablesWithFilters,
  fetchOuByName,
  fetchDeliverableByName,
  fetchUserByName,
  fetchByP3Name,
  fetchDeliverableIssues,
  fetchDeliverableTasks,
  fetchEkahiIssue,
  fetchEkahiTask,
  // fetchComposeQueryFetch,
};
