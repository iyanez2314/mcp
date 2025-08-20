/**
 * Firestore operators for filtering.
 */
export type FirestoreOperator = "=" | "!=" | ">" | ">=" | "<" | "<=" | "in" | "not-in" | "array-contains" | "array-contains-any";
/**
 * Logical operators for combining conditions.
 */
export type LogicalOperator = "AND" | "OR";
/**
 * Represents a single filter condition.
 */
export interface FilterCondition {
    field: string;
    operator: FirestoreOperator | string;
    value: any;
}
/**
 * Represents a group of filter conditions combined by a logical operator.
 */
export interface FilterGroup {
    logicalOperator: LogicalOperator;
    conditions: (FilterCondition | FilterGroup)[];
}
//# sourceMappingURL=queryFilters.d.ts.map