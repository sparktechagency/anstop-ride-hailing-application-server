import { USER_ROLES } from "../user/user.constant";
import { User } from "../user/user.model";
import { Transaction } from "../transaction/transaction.model";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../transaction/transaction.constant";
// const dashboardStats = async () => {
//     const totalUsers = await User.countDocuments();
//     const totalRider = await User.countDocuments({ role: USER_ROLES.RIDER });
//     const totalDriver = await User.countDocuments({ role: USER_ROLES.DRIVER });
//     const totalTransactions = await Transaction.countDocuments();

//     const totalCompletedTransactions = await Transaction.countDocuments({ status: TRANSACTION_STATUS.COMPLETED });
//     const totalFailedTransactions = await Transaction.countDocuments({ status: TRANSACTION_STATUS.FAILED });

//     const totalTransactionAmount = await Transaction.aggregate([
//         {
//             $match: {
//                 status: TRANSACTION_STATUS.COMPLETED
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalTransactionAmount: {
//                     $sum: "$amount"
//                 }
//             }
//         }
//     ])


//     // Withdrawals stats

//     const totalWithdrawalsRequestCount = await WithdrawalRequest.countDocuments();


//     const totalPendingWithdrawalRequest = await WithdrawalRequest.countDocuments({ status: WITHDRAWAL_STATUS.PENDING });
//     const totalPendingWithdrawalRequestAmount = await WithdrawalRequest.aggregate([
//         {
//             $match: {
//                 status: WITHDRAWAL_STATUS.PENDING
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalPendingWithdrawalRequestAmount: {
//                     $sum: "$amount"
//                 }
//             }
//         }
//     ])

//     const totalRejectedWithdrawalRequest = await WithdrawalRequest.countDocuments({ status: WITHDRAWAL_STATUS.REJECTED });
//     const totalRejectedWithdrawalRequestAmount = await WithdrawalRequest.aggregate([
//         {
//             $match: {
//                 status: WITHDRAWAL_STATUS.REJECTED
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalRejectedWithdrawalRequestAmount: {
//                     $sum: "$amount"
//                 }
//             }
//         }
//     ])

//     const totalCompletedWithdrawalRequest = await WithdrawalRequest.countDocuments({ status: WITHDRAWAL_STATUS.COMPLETED });
//     const totalCompletedWithdrawalRequestAmount = await WithdrawalRequest.aggregate([
//         {
//             $match: {
//                 status: WITHDRAWAL_STATUS.COMPLETED
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalCompletedWithdrawalRequestAmount: {
//                     $sum: "$amount"
//                 }
//             }
//         }
//     ])






//     const totalDepositsCount = await Transaction.countDocuments({ type: TRANSACTION_TYPE.DEPOSIT });
//     const totalDepositsAmount = await Transaction.aggregate([
//         {
//             $match: {
//                 type: TRANSACTION_TYPE.DEPOSIT,
//                 status: TRANSACTION_STATUS.COMPLETED
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalDepositsAmount: {
//                     $sum: "$amount"
//                 }
//             }
//         }
//     ])

//     const totalRideFareCount = await Transaction.countDocuments({ type: TRANSACTION_TYPE.RIDE_FARE });
//     const totalRideFare = await Transaction.aggregate([
//         {
//             $match: {
//                 type: TRANSACTION_TYPE.RIDE_FARE,
//                 status: TRANSACTION_STATUS.COMPLETED
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalRideFare: {
//                     $sum: "$amount"
//                 }
//             }
//         }
//     ])


//     const totalTipsCount = await Transaction.countDocuments({ type: TRANSACTION_TYPE.RIDE_TIP });
//     const totalTipsAmount = await Transaction.aggregate([
//         {
//             $match: {
//                 type: TRANSACTION_TYPE.RIDE_TIP,
//                 status: TRANSACTION_STATUS.COMPLETED
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalTipsAmount: {
//                     $sum: "$amount"
//                 }
//             }
//         }
//     ])





//     const totalRides = await Ride.countDocuments();
//     const totalEarnings = await Ride.aggregate([
//         {
//             $match: {
//                 status: "COMPLETED"
//             }
//         },
//         {
//             $group: {
//                 _id: null,
//                 totalEarnings: {
//                     $sum: "$fare"
//                 }
//             }
//         }
//     ])
// }



const dashboardStats = async () => {

    const totalUsers = await User.countDocuments();
    const totalRiders = await User.countDocuments({ role: USER_ROLES.RIDER });
    const totalDrivers = await User.countDocuments({ role: USER_ROLES.DRIVER });


    const totalRevenue = await Transaction.aggregate([
        {
            $match: {
                type: TRANSACTION_TYPE.RIDE_FARE,
                status: TRANSACTION_STATUS.COMPLETED
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$commissionAmount"
                }
            }
        }
    ])

    const totalWithdrawals = await Transaction.aggregate([
        {
            $match: {
                type: TRANSACTION_TYPE.WITHDRAWAL,
                status: TRANSACTION_STATUS.COMPLETED
            }
        },
        {
            $group: {
                _id: null,
                totalWithdrawals: {
                    $sum: "$driverEarningAmount"
                }
            }
        }
    ])

    return {
        totalUsers,
        totalRiders,
        totalDrivers,
        totalRevenue,
        totalWithdrawals,
    }
}


const earningsChart = async (filter: {
    startDate: Date,
    endDate: Date,
}) => {
    // earnings by breaking down by month and retrun monthly earnings and if no earnings in a month return 0 on that month

    const earnings = await Transaction.aggregate([
        {
            $match: {
                type: TRANSACTION_TYPE.RIDE_FARE,
                status: TRANSACTION_STATUS.COMPLETED,
                createdAt: {
                    $gte: filter.startDate,
                    $lte: filter.endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    month: {
                        $month: "$createdAt"
                    },
                    year: {
                        $year: "$createdAt"
                    }
                },
                totalEarnings: {
                    $sum: "$commissionAmount"
                }
            }
        }
    ])

    return earnings
}

const earningStats = async () => {
    
    const totalTransactionAmount = await Transaction.aggregate([
        {
            $match: {
                status: TRANSACTION_STATUS.COMPLETED
            }
        },
        {
            $group: {
                _id: null,
                totalTransactionAmount: {
                    $sum: "$amount"
                }
            }
        }
    ])

    const totalDriverWithdrawableAmount = await Transaction.aggregate([
        {
            $match: {
                type: TRANSACTION_TYPE.RIDE_FARE,
                status: TRANSACTION_STATUS.COMPLETED
            }
        },
        {
            $group: {
                _id: null,
                totalDriverWithdrawableAmount: {
                    $sum: "$driverEarningAmount"
                }
            }
        }
    ])

    const totalDriver = await User.countDocuments({ role: USER_ROLES.DRIVER })

    return {
        totalTransactionAmount,
        totalDriverWithdrawableAmount,
        totalDriver,
    }
}


export const AdminService = {
    dashboardStats,
    earningsChart,
    earningStats
}