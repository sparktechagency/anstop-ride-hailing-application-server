const WALLET_TYPE = {
    USER: "USER",
    PLATFORM: "PLATFORM",
} as const;

 const WALLET_STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    SUSPENDED: "SUSPENDED",
    LOCKED: "LOCKED",
} as const;

export const WalletConstant = {
    WALLET_TYPE,
    WALLET_STATUS
}