export default [
  {
    constant: true,
    inputs: [
      {
        name: "token",
        type: "address",
      },
    ],
    name: "getPrice",
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
    stateMutability: "view",
    type: "function",
  },
];
