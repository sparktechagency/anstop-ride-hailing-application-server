import mongoose from "mongoose";
import { Ride } from "../ride.model";
import ridesSeedData from "./seed-data";

export const seedRides = async () => {
  try {
    // Connect to MongoDB


    // Clear existing rides (optional - comment out if you want to keep existing data)
    await Ride.deleteMany({});
    console.log("✓ Cleared existing rides");

    // Insert seed data
    const insertedRides = await Ride.insertMany(ridesSeedData);
    console.log(`✓ Successfully inserted ${insertedRides.length} rides`);

    // Display summary
    const summary = {
      total: await Ride.countDocuments(),
      accepted: await Ride.countDocuments({ status: "ACCEPTED" }),
      ongoing: await Ride.countDocuments({ status: "ON_GOING" }),
      completed: await Ride.countDocuments({ status: "COMPLETED" }),
      cancelled: await Ride.countDocuments({ status: "CANCELLED" })
    };

    console.log("\n📊 Rides Summary:");
    console.log(`   Total: ${summary.total}`);
    console.log(`   Accepted: ${summary.accepted}`);
    console.log(`   Ongoing: ${summary.ongoing}`);
    console.log(`   Completed: ${summary.completed}`);
    console.log(`   Cancelled: ${summary.cancelled}`);

    // Display ride needs usage
    const rideNeeds = await Ride.aggregate([
      { $unwind: "$rideNeeds" },
      { $group: { _id: "$rideNeeds", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    if (rideNeeds.length > 0) {
      console.log("\n🛣️  Ride Needs Used:");
      rideNeeds.forEach(need => {
        console.log(`   ${need._id}: ${need.count}`);
      });
    }

    console.log("\n✅ Seed completed successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding rides:", error);
    process.exit(1);
  }
};
