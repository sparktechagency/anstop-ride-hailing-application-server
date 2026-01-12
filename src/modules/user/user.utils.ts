import { TSaveAddressDto } from "./user.dto";
import { TLocation } from "./user.interface";

	export const locationExists = (existing:TLocation, incoming: TSaveAddressDto) => 
	existing?.name === incoming.name ||
	(existing?.coordinates[0] === incoming.longitude && 
	 existing?.coordinates[1] === incoming.latitude);