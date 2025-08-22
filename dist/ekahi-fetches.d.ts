import { FilterGroup } from "./queryFilters.js";
declare const fetchEkahiUsers: () => Promise<any>;
declare const fetchEkahiUser: (id: string) => Promise<any>;
declare const fetchEkahiDeliverable: (id: string) => Promise<any>;
declare const fetchEkahiDeliverables: () => Promise<any>;
declare const fetchEkahiDeliverablesWithFilters: (filters?: FilterGroup, join?: string[]) => Promise<any>;
declare const fetchOuByName: (searchValue: string) => Promise<any>;
declare const fetchDeliverableByName: (deliverableName: string) => Promise<any>;
declare const fetchUserByName: (userName: string) => Promise<any>;
declare const fetchByP3Name: (p3Name: string) => Promise<any>;
declare const fetchDeliverableIssues: (deliverableId: string) => Promise<any>;
declare const fetchDeliverableTasks: (deliverableId: string) => Promise<any>;
declare const fetchEkahiIssue: (idOrName: string) => Promise<any>;
declare const fetchEkahiTask: (idOrName: string) => Promise<any>;
export { fetchEkahiUsers, fetchEkahiUser, fetchEkahiDeliverable, fetchEkahiDeliverables, fetchEkahiDeliverablesWithFilters, fetchOuByName, fetchDeliverableByName, fetchUserByName, fetchByP3Name, fetchDeliverableIssues, fetchDeliverableTasks, fetchEkahiIssue, fetchEkahiTask, };
//# sourceMappingURL=ekahi-fetches.d.ts.map