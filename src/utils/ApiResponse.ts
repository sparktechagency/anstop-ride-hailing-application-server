import { TPaginateOptions } from "../types/paginate";

interface TMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface TResponse<T> {
    statusCode: number;
    success?: boolean;
    message?: string;
    meta?: TPaginateOptions;
    data: T;
}

class ApiResponse<T> {
    statusCode: number;
    success?: boolean;
    message?: string;
    meta?: TPaginateOptions;
    data: T;

    constructor({ statusCode, success = true, message, data, meta }: TResponse<T>) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.data =  data;
        this.meta = meta;
    }
}

export default ApiResponse;
