import { model, Schema } from "mongoose";
import { IDriverModel, TDriver, TLocation } from "./driver.interface";
import { SERVICETYPES } from "../rideRequest/rideRequest.interface";
import paginate from "../../utils/paginate";

const regionalInfoSchema = new Schema({
	city: {
		type: String,
		default: "",
	},
	province: {
		type: String,
		default: "",
	},
	country: {
		type: String,
		default: "",
	},
});

const vehicleInfoSchema = new Schema({
	brand: {
		type: String,
		default: "",
	},
	model: {
		type: String,
		default: "",
	},
	manufactureYear: {
		type: Date,
		default: "",
	},
	color: {
		type: String,
		default: "",
	},
	plateNumber: {
		type: String,
		default: "",
	},
});

const POWE_documentInfoSchema = new Schema({
	documentType: {
		type: String,
		default: "",
	},
	image: {
		type: String,
		default: "",
	},
});

const vehicleDocumentInfoSchema = new Schema({
	vehicleImage: {
		type: String,
		default: "",
	},
	vehicleRegistrationImage: {
		type: String,
		default: "",
	},
	vehicleInspectionImage: {
		type: String,
		default: "",
	},
	vehicleInsuranceImage: {
		type: String,
		default: "",
	},
});

const locationSchema = new Schema<TLocation>(
	{
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number], // [longitude, latitude]
			required: true,
		},
	},
	{ _id: false }
);

const DriverSchema = new Schema<TDriver, IDriverModel>(
	{
		regionalInformation: regionalInfoSchema,
		serviceType: {
			type: String,
			enum: SERVICETYPES,
		},
		vehicleInformation: vehicleInfoSchema,
		workEligibilityDocument: POWE_documentInfoSchema,

		vehicleDocuments: vehicleDocumentInfoSchema,
		currentLocation: locationSchema,
	},
	{
		timestamps: true,
	}
);

DriverSchema.index({ location: "2dsphere" });
DriverSchema.plugin(paginate);

export const Driver = model<TDriver, IDriverModel>("Driver", DriverSchema);
