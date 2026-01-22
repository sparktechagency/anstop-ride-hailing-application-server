import { Types } from "mongoose";

const driverId = new Types.ObjectId("6964836a712b5d292425a974");
const riderId = new Types.ObjectId("6964855a31e70d5a42c2ebec");

const ridesSeedData = [
  // 1 ACCEPTED RIDE
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Main Street Station",
      coordinates: [-74.0060, 40.7128]
    },
    destination: {
      name: "Park Avenue Center",
      coordinates: [-73.9855, 40.7580]
    },
    distance: "2.5 km",
    baseFare: 150,
    finalFare: 150,
    note: "Please arrive on time",
    rideNeeds: ["WHEELCHAIR_ACCESSIBLE", "PET_FRIENDLY"],
    status: "ACCEPTED",
    paymentMethod: "CARD",
    createdAt: new Date("2024-12-20T10:00:00Z"),
    updatedAt: new Date("2024-12-20T10:05:00Z")
  },

  // 5 COMPLETED RIDES
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Oak Road Suburbs",
      coordinates: [-74.0445, 40.6892]
    },
    destination: {
      name: "Elm Street Downtown",
      coordinates: [-74.0060, 40.7128]
    },
    distance: "5.2 km",
    baseFare: 280,
    finalFare: 298,
    note: "Drop at main entrance",
    rideNeeds: ["EXTRA_LUGGAGE_SPACE"],
    status: "COMPLETED",
    paymentMethod: "CASH",
    createdAt: new Date("2024-12-19T14:30:00Z"),
    updatedAt: new Date("2024-12-19T15:15:00Z")
  },
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Maple Drive Northwest",
      coordinates: [-73.9776, 40.7614]
    },
    destination: {
      name: "Cedar Lane Airport",
      coordinates: [-73.8740, 40.7769]
    },
    distance: "8.7 km",
    baseFare: 420,
    finalFare: 478,
    note: "Going to airport terminal 2",
    rideNeeds: ["EXTRA_LUGGAGE_SPACE", "WHEELCHAIR_ACCESSIBLE"],
    status: "COMPLETED",
    paymentMethod: "CARD",
    createdAt: new Date("2024-12-18T08:45:00Z"),
    updatedAt: new Date("2024-12-18T09:45:00Z")
  },
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Birch Boulevard East Side",
      coordinates: [-73.9680, 40.7489]
    },
    destination: {
      name: "Spruce Street West Side",
      coordinates: [-74.0055, 40.7505]
    },
    distance: "3.1 km",
    baseFare: 195,
    finalFare: 215,
    note: "",
    rideNeeds: ["CHILD_SEAT"],
    status: "COMPLETED",
    paymentMethod: "WALLET",
    createdAt: new Date("2024-12-17T19:20:00Z"),
    updatedAt: new Date("2024-12-17T19:50:00Z")
  },
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Walnut Court North Side",
      coordinates: [-73.9734, 40.7850]
    },
    destination: {
      name: "Chestnut Place South Side",
      coordinates: [-73.9162, 40.6976]
    },
    distance: "9.4 km",
    baseFare: 450,
    finalFare: 495,
    note: "Premium ride requested",
    rideNeeds: ["EXTRA_LUGGAGE_SPACE", "WHEELCHAIR_ACCESSIBLE", "PET_FRIENDLY"],
    status: "COMPLETED",
    paymentMethod: "CARD",
    createdAt: new Date("2024-12-16T11:00:00Z"),
    updatedAt: new Date("2024-12-16T12:15:00Z")
  },
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Pine Street Central",
      coordinates: [-73.9896, 40.7407]
    },
    destination: {
      name: "Ash Avenue East Village",
      coordinates: [-73.9848, 40.7249]
    },
    distance: "1.8 km",
    baseFare: 120,
    finalFare: 120,
    note: "Quick trip",
    rideNeeds: [],
    status: "COMPLETED",
    paymentMethod: "WALLET",
    createdAt: new Date("2024-12-15T16:45:00Z"),
    updatedAt: new Date("2024-12-15T17:05:00Z")
  },

  // 4 CANCELLED RIDES
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Alder Lane Downtown",
      coordinates: [-74.0060, 40.7128]
    },
    destination: {
      name: "Poplar Street Uptown",
      coordinates: [-73.9544, 40.8060]
    },
    distance: "4.2 km",
    baseFare: 240,
    finalFare: 240,
    note: "Cancelled due to emergency",
    rideNeeds: ["PET_FRIENDLY"],
    status: "CANCELLED",
    paymentMethod: "CARD",
    cancellationInfo: {
      cancelledBy: "RIDER",
      reason: "Emergency came up",
      cancelledAt: new Date("2024-12-20T09:30:00Z"),
      refundAmount: 240,
      refundStatus: "PROCESSED"
    },
    createdAt: new Date("2024-12-20T09:20:00Z"),
    updatedAt: new Date("2024-12-20T09:30:00Z")
  },
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Sycamore Road Riverside",
      coordinates: [-74.0132, 40.7031]
    },
    destination: {
      name: "Hickory Hill Heights",
      coordinates: [-73.9231, 40.8400]
    },
    distance: "11.5 km",
    baseFare: 550,
    finalFare: 550,
    note: "Driver cancelled unexpectedly",
    rideNeeds: ["EXTRA_LUGGAGE_SPACE"],
    status: "CANCELLED",
    paymentMethod: "CARD",
    cancellationInfo: {
      cancelledBy: "DRIVER",
      reason: "Vehicle breakdown",
      cancelledAt: new Date("2024-12-14T13:45:00Z"),
      refundAmount: 550,
      refundStatus: "PROCESSED"
    },
    createdAt: new Date("2024-12-14T13:30:00Z"),
    updatedAt: new Date("2024-12-14T13:45:00Z")
  },
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Juniper Junction Midtown",
      coordinates: [-73.9855, 40.7580]
    },
    destination: {
      name: "Dogwood Drive Harbor",
      coordinates: [-74.0088, 40.7061]
    },
    distance: "6.3 km",
    baseFare: 320,
    finalFare: 320,
    note: "Rider not found at pickup location",
    rideNeeds: ["CHILD_SEAT", "WHEELCHAIR_ACCESSIBLE"],
    status: "CANCELLED",
    paymentMethod: "WALLET",
    cancellationInfo: {
      cancelledBy: "DRIVER",
      reason: "Rider no show",
      cancelledAt: new Date("2024-12-13T10:20:00Z"),
      refundAmount: 0,
      refundStatus: "PENDING"
    },
    createdAt: new Date("2024-12-13T10:00:00Z"),
    updatedAt: new Date("2024-12-13T10:20:00Z")
  },
  {
    riderId: riderId,
    driverId: driverId,
    pickup: {
      name: "Linden Lane West End",
      coordinates: [-74.0021, 40.7614]
    },
    destination: {
      name: "Magnolia Mall East End",
      coordinates: [-73.8845, 40.7128]
    },
    distance: "7.0 km",
    baseFare: 360,
    finalFare: 360,
    note: "System cancelled",
    rideNeeds: [],
    status: "CANCELLED",
    paymentMethod: "CARD",
    cancellationInfo: {
      cancelledBy: "SYSTEM",
      reason: "No driver available",
      cancelledAt: new Date("2024-12-12T15:00:00Z"),
      refundAmount: 360,
      refundStatus: "PROCESSED"
    },
    createdAt: new Date("2024-12-12T14:50:00Z"),
    updatedAt: new Date("2024-12-12T15:00:00Z")
  }
];

export default ridesSeedData;