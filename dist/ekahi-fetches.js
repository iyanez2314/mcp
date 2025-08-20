const EKAHI_API_URL = process.env.EKAHI_API_URL;
const CLOUD_FN_TOKEN = process.env.CLOUD_FN_TOKEN;
if (!EKAHI_API_URL || !CLOUD_FN_TOKEN) {
    throw new Error("EKAHI_API_URL and CLOUD_FN_TOKEN environment variables must be set");
}
var operator;
(function (operator) {
    operator["EQUALS"] = "=";
    operator["NOT_EQUALS"] = "!=";
    operator["GREATER_THAN"] = ">";
    operator["LESS_THAN"] = "<";
    operator["GREATER_THAN_OR_EQUAL"] = ">=";
    operator["LESS_THAN_OR_EQUAL"] = "<=";
    operator["IN"] = "IN";
    operator["ARRAY_CONTAINS"] = "ARRAY_CONTAINS";
    operator["ARRAY_CONTAINS_ANY"] = "ARRAY_CONTAINS_ANY";
})(operator || (operator = {}));
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
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
};
const fetchEkahiUser = async (id) => {
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
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};
const fetchEkahiDeliverable = async (id) => {
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
    }
    catch (error) {
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
    }
    catch (error) {
        console.error("Error fetching deliverables:", error);
        return null;
    }
};
const fetchEkahiDeliverablesWithFilters = async (filters) => {
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
    }
    catch (error) {
        console.error("Error fetching filtered deliverables:", error);
        return null;
    }
};
export { fetchEkahiUsers, fetchEkahiUser, fetchEkahiDeliverable, fetchEkahiDeliverables, fetchEkahiDeliverablesWithFilters, };
//# sourceMappingURL=ekahi-fetches.js.map