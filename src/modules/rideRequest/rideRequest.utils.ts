

import axios from "axios";

export const ComputeRoute = async (pickup: { latitude: number, longitude: number }, dropoff: { latitude: number, longitude: number }) => {
    try {
        const response = await axios.post(
            "https://routes.googleapis.com/directions/v2:computeRoutes",
            {
                origin: {
                    location: {
                        latLng: {
                            latitude: pickup.latitude,
                            longitude: pickup.longitude,
                        },
                    },
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: dropoff.latitude,
                            longitude: dropoff.longitude,
                        },
                    },
                },
                travelMode: "DRIVE",
                routingPreference: "TRAFFIC_AWARE",
                computeAlternativeRoutes: false,
                routeModifiers: {
                    avoidTolls: false,
                    avoidHighways: false,
                    avoidFerries: false,
                },
                languageCode: "en-US",
                units: "METRIC",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
                    "X-Goog-FieldMask":
                        "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
                },
            }
        );

        const route = response.data.routes[0];

        return {
            distanceKm: route.distanceMeters / 1000,
            durationSeconds: parseInt(route.duration.replace("s", "")),
            encodedPolyline: route.polyline?.encodedPolyline,
        };
    } catch (error: any) {
        console.error(
            error.response?.data || error.message
        );
        throw new Error("Failed to compute route");
    }
};
