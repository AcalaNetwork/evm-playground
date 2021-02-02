export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        name: "contract_address",
        type: "address",
      },
      {
        indexed: true,
        name: "block_number",
        type: "uint256",
      },
      {
        indexed: false,
        name: "index",
        type: "uint256",
      },
    ],
    name: "ScheduledCall",
    type: "event",
  },
  {
    constant: false,
    inputs: [
      {
        name: "contract_address",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
      {
        name: "gas_limit",
        type: "uint256",
      },
      {
        name: "storage_limit",
        type: "uint256",
      },
      {
        name: "min_delay",
        type: "uint256",
      },
      {
        name: "input_data",
        type: "bytes",
      },
    ],
    name: "scheduleCall",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
