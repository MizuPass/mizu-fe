import type { Address } from 'viem'

// MizuPassIdentity Contract Configuration
export const MIZUPASS_IDENTITY_ADDRESS: Address = '0x370C6f14d8AF4e7e014Dc308DDFCE4322101Cffe'

export const MIZUPASS_IDENTITY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "dexRouter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "whitelisted",
        "type": "bool"
      }
    ],
    "name": "DexWhitelistUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "enum MizuPassIdentity.UserRole",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "registerUserRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "uniqueIdentifier",
        "type": "bytes32"
      }
    ],
    "name": "registerZKPassportUser",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_dexRouter",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_whitelisted",
        "type": "bool"
      }
    ],
    "name": "updateDexWhitelist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum MizuPassIdentity.UserRole",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "UserRoleRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "nullifierHash",
        "type": "bytes32"
      }
    ],
    "name": "ZKPassportVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "dexWhitelist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUniqueIdentifier",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserRole",
    "outputs": [
      {
        "internalType": "enum MizuPassIdentity.UserRole",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isEventCreator",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isRegularUser",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isUserRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isVerifiedUser",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isZKPassportVerified",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIZUHIKI_SBT_CONTRACT",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "usedIdentifiers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userRoles",
    "outputs": [
      {
        "internalType": "enum MizuPassIdentity.UserRole",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "verifyMizuhikiSBT",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "zkPassportIdentifiers",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// User Role Constants
export const UserRole = {
  EVENT_CREATOR: 1,
  REGULAR_USER: 2
} as const

export type UserRoleType = typeof UserRole[keyof typeof UserRole]

// Mock JPYM Token Contract Configuration  
export const JPYM_TOKEN_ADDRESS: Address = '0xB362A6b349940f1086FC4834fE1EdE42544A1758'

// Legacy export for backward compatibility
export const MJPY_TOKEN_ADDRESS: Address = JPYM_TOKEN_ADDRESS

export const ERC20_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

// JPYM Token ABI (Mock Token)
export const JPYM_ABI = ERC20_ABI // Using standard ERC20 ABI for mock token

// Mizu Event Registry Contract Configuration
export const MIZU_EVENT_REGISTRY_ADDRESS: Address = '0x5004a7708FD24D67e72EC9b876f2F44aefe4D6f9'

export const MIZU_EVENT_REGISTRY_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_identityContract",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "eventContract",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        }
      ],
      "name": "EventCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newFee",
          "type": "uint256"
        }
      ],
      "name": "EventCreationFeeUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newJPYMAddress",
          "type": "address"
        }
      ],
      "name": "JPYMAddressUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newGateway",
          "type": "address"
        }
      ],
      "name": "PaymentGatewayUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newPlatformWallet",
          "type": "address"
        }
      ],
      "name": "PlatformWalletUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "EVENT_CREATION_FEE_JPYM",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "JPYM",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "JPYM_DECIMALS",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ticketIpfsHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "ticketPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxTickets",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "eventDate",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "eventName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "eventSymbol",
          "type": "string"
        }
      ],
      "name": "createEvent",
      "outputs": [
        {
          "internalType": "address",
          "name": "eventContract",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "eventContracts",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "eventCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllActiveEvents",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "eventIds",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "eventContractAddresses",
          "type": "address[]"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "organizer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "ticketIpfsHash",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "ticketPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxTickets",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "ticketsSold",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "eventDate",
              "type": "uint256"
            }
          ],
          "internalType": "struct IEventContract.EventData[]",
          "name": "eventDataArray",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        }
      ],
      "name": "getEventContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "eventId",
          "type": "uint256"
        }
      ],
      "name": "getEventDetails",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "organizer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "ticketIpfsHash",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "ticketPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxTickets",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "ticketsSold",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "eventDate",
              "type": "uint256"
            }
          ],
          "internalType": "struct IEventContract.EventData",
          "name": "eventData",
          "type": "tuple"
        },
        {
          "internalType": "address",
          "name": "eventContract",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        }
      ],
      "name": "getOrganizerActiveEvents",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "eventIds",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "eventContractAddresses",
          "type": "address[]"
        },
        {
          "components": [
            {
              "internalType": "address",
              "name": "organizer",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "ticketIpfsHash",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "ticketPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxTickets",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "ticketsSold",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "eventDate",
              "type": "uint256"
            }
          ],
          "internalType": "struct IEventContract.EventData[]",
          "name": "eventDataArray",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "organizer",
          "type": "address"
        }
      ],
      "name": "getOrganizerEvents",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalEvents",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "identityContract",
      "outputs": [
        {
          "internalType": "contract MizuPassIdentity",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "organizerEvents",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paymentGateway",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "platformWallet",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_jpymAddress",
          "type": "address"
        }
      ],
      "name": "setJPYMAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_paymentGateway",
          "type": "address"
        }
      ],
      "name": "setPaymentGateway",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_platformWallet",
          "type": "address"
        }
      ],
      "name": "setPlatformWallet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

// Contract functions categorized by purpose
export const CONTRACT_FUNCTIONS = {
  // User Registration & Role Management
  USER_MANAGEMENT: {
    registerUserRole: 'registerUserRole',
    registerZKPassportUser: 'registerZKPassportUser',
    getUserRole: 'getUserRole',
    isUserRegistered: 'isUserRegistered'
  },
  
  // Verification Functions
  VERIFICATION: {
    isVerifiedUser: 'isVerifiedUser',
    isZKPassportVerified: 'isZKPassportVerified',
    verifyMizuhikiSBT: 'verifyMizuhikiSBT',
    getUniqueIdentifier: 'getUniqueIdentifier'
  },
  
  // Role Checking
  ROLE_CHECKING: {
    isRegularUser: 'isRegularUser',
    isEventCreator: 'isEventCreator'
  },
  
  // Admin Functions
  ADMIN: {
    updateDexWhitelist: 'updateDexWhitelist',
    owner: 'owner'
  }
}

// Event Registry Contract functions
export const EVENT_REGISTRY_FUNCTIONS = {
  // Event Creation & Management
  EVENT_MANAGEMENT: {
    createEvent: 'createEvent',
    getEventContract: 'getEventContract',
    getEventDetails: 'getEventDetails',
    getTotalEvents: 'getTotalEvents',
    eventCounter: 'eventCounter'
  },
  
  // Event Queries
  EVENT_QUERIES: {
    getAllActiveEvents: 'getAllActiveEvents',
    getOrganizerEvents: 'getOrganizerEvents',
    getOrganizerActiveEvents: 'getOrganizerActiveEvents'
  },
  
  // Contract Configuration
  CONTRACT_CONFIG: {
    EVENT_CREATION_FEE_JPYM: 'EVENT_CREATION_FEE_JPYM',
    JPYM: 'JPYM',
    JPYM_DECIMALS: 'JPYM_DECIMALS',
    identityContract: 'identityContract',
    paymentGateway: 'paymentGateway',
    platformWallet: 'platformWallet'
  },
  
  // Admin Functions
  ADMIN: {
    setPaymentGateway: 'setPaymentGateway',
    setPlatformWallet: 'setPlatformWallet',
    withdrawFees: 'withdrawFees',
    owner: 'owner'
  }
}

// Identity Contract Export
export default {
  address: MIZUPASS_IDENTITY_ADDRESS,
  abi: MIZUPASS_IDENTITY_ABI,
  functions: CONTRACT_FUNCTIONS,
  userRoles: UserRole
}

// Event Registry Contract Export
export const EventRegistryContract = {
  address: MIZU_EVENT_REGISTRY_ADDRESS,
  abi: MIZU_EVENT_REGISTRY_ABI,
  functions: EVENT_REGISTRY_FUNCTIONS
}

