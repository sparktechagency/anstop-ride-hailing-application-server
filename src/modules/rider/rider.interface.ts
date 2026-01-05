import { Types } from "mongoose";
import { TAddress } from "../../shared/shared.interface";


export type TSavedAddresses = {
	_id?: Types.ObjectId;
	title: string;
	address: TAddress;
};

export type TRider = {
	_id?: Types.ObjectId;
	user: Types.ObjectId;
	savedAddresses: TSavedAddresses[];
	trustedContacts: string[];
	rides: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
};


