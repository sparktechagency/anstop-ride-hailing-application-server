class SocketError extends Error {
  event: string;
  message: string;
  data: any;
  success: boolean;

  constructor(event: string, message: string, data: any) {
    super(message);
    this.event = event;
    this.message = message;
    this.data = data;
    this.success = false;
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
