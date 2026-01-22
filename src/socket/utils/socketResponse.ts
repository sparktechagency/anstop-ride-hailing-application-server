export type TSocketResponse = {
	success: boolean;
	message: string;
	data: any;
};

class SocketResponse {
	success: boolean;
	message: string;
	data: any;

	constructor(message: string = "", data: any) {
		this.success = true;
		this.message = message;
		this.data = data;
	}
}

export default SocketResponse;
