export const userSocketMap = new Map<string, Set<string>>(); // userId -> Set<socket.id>
export const driverSocketMap = new Map<string, Set<string>>();

export const addSocketToMap = (map: Map<string, Set<string>>, id: string, socketId: string) => {
	if (!map.has(id)) map.set(id, new Set());
	map.get(id)!.add(socketId);
};

export const removeSocketFromMap = (map: Map<string, Set<string>>, id: string, socketId: string) => {
	if (map.has(id)) {
		map.get(id)!.delete(socketId);
		if (map.get(id)!.size === 0) map.delete(id);
	}
};