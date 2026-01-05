import { FilterQuery, Schema } from "mongoose";
import { TPaginateOptions, TPaginateResult } from "../types/paginate";

const paginate = <T>(schema: Schema<T>) => {
	schema.statics.paginate = async function (
		filter: FilterQuery<T>,
		options: TPaginateOptions
	): Promise<TPaginateResult<T>> {
		// const limit = Number(options.limit) ?? 10;
		// const page = Number(options.page) ?? 1;
		const limit = isNaN(Number(options.limit)) ? 10 : Number(options.limit);
		const page = isNaN(Number(options.page)) ? 1 : Number(options.page);

		const sortBy = options.sortBy ?? "createdAt";

		console.log(sortBy);
		const sortOrder = options.sortOrder ?? 1;

		// Count total documents
		const totalResults = await this.countDocuments(filter).exec();
		const totalPages = Math.ceil(totalResults / limit);

		const skip = (page - 1) * limit;

		let query = this.find(filter)
			.select(options.select)
			.sort({ [sortBy]: sortOrder })
			.skip(skip)
			.limit(limit);

		if (options.populate) {
			query = query.populate(options.populate);
		}

		const results = await query.exec();

		return {
			results,
			page,
			limit,
			totalPages,
			totalResults,
		};
	};
};

export default paginate;
