forge create --rpc-url https://ethereum-holesky-rpc.publicnode.com/c5d966c815c0209e57d6df709ad05f4b4c2df451da91d4bfdb2356f1d8f014cf \
    --constructor-args 0x036CbD53842c5426634e7929541eC2318f3dCF7e  \
    --private-key=$PRIVATE_KEY \
    --etherscan-api-key Z8T3QT6BPMNVE6PAFIZ24RITMISKD1VXN4 \
    --verify \
    src/BitDSMStake.sol:BitDSMStake
