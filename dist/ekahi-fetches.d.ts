import { FilterGroup } from "./queryFilters.js";
declare const fetchEkahiUsers: () => Promise<any>;
declare const fetchEkahiUser: (id: string) => Promise<any>;
declare const fetchEkahiDeliverable: (id: string) => Promise<any>;
declare const fetchEkahiDeliverables: () => Promise<any>;
declare const fetchEkahiDeliverablesWithFilters: (filters?: FilterGroup, join?: string[]) => Promise<any>;
export { fetchEkahiUsers, fetchEkahiUser, fetchEkahiDeliverable, fetchEkahiDeliverables, fetchEkahiDeliverablesWithFilters, fetchComposeQueryFetch, };
//# sourceMappingURL=ekahi-fetches.d.ts.map