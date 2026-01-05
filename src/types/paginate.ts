export interface TPaginateOptions {
	limit?: number;
	page?: number;
	sortBy?: string;
	select?: string;
	populate?: any;
	sortOrder?: number;
}
export interface TPaginateResult<T> {
	results: T[];
	page: number;
	limit: number;
	totalPages: number;
	totalResults: number;
}
