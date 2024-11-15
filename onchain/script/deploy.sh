forge create --rpc-url $RPC_URL \
    --constructor-args $ADVANCE_RATE \
    --private-key $PRIVATE_KEY \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --verify \
    src/Trustme.sol:Trustme
