class SocketError {
  event: string;
  message: string;
  data: any;
  success: boolean;

  constructor(event: string, message: string, data: any) {
    this.success = false;
    this.event = event;
    this.message = message;
    this.data = data;
  }

  toResponse() {
    return {
      success: false,
      error: {
        event: this.event,
        success: this.success,
        message: this.message,
        data: this.data,
      },
    };
  }
}

export default SocketError;
