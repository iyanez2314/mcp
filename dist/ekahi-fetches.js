const EKAHI_API_URL = process.env.EKAHI_API_URL;
const CLOUD_FN_TOKEN = process.env.CLOUD_FN_TOKEN;
if (!EKAHI_API_URL || !CLOUD_FN_TOKEN) {
    throw new Error("EKAHI_API_URL and CLOUD_FN_TOKEN environment variables must be set");
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
const fetchEkahiDeliverablesWithFilters = async (filters, join) => {
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
        }
        else {
            // Default joins for common document references
            const defaultJoins = ["accountableOu", "createdBy", "assignedTo"];
            defaultJoins.forEach((join) => params.append("join", join));
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