export const userSocketMap = new Map<string, Set<string>>();
export const userRoomMap = new Map<string, Set<string>>();

export const addToMap = (
  map: Map<string, Set<string>>,
  id: string,
  target: string
) => {
  if (!map.has(id)) map.set(id, new Set());
  map.get(id)!.add(target);
};

export const removeFromMap = (
  map: Map<string, Set<string>>,
  id: string,
  target: string
) => {
  if (map.has(id)) {
    map.get(id)!.delete(target);
    if (map.get(id)!.size === 0) map.delete(id);
  }
};
