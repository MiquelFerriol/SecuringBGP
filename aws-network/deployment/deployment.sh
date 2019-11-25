NODE=$(grep NODE .env | xargs)
IFS='=' read -ra NODE <<< "$NODE"
NODENUM=${NODE[1]}
echo $NODENUM

docker-compose -f docker-compose-node$NODENUM.yml up -d

docker cp channelall.block peer0.as$NODENUM.example.com:/channelall.block

docker exec -e "CORE_PEER_MSPCONFIGPATH=/var/hyperledger/users/Admin@as$NODENUM.example.com/msp" peer0.as$NODENUM.example.com peer channel join -b channelall.block

docker exec cli peer chaincode install -n communitycontract -v 0 -p /opt/gopath/src/github.com/chaincode -l node

docker exec cli peer chaincode instantiate -o orderer.example.com:7050 -C channelall -n communitycontract -v 0 -l node -c '{"Args":["securingBGP.community:instantiate"]}' -P "OR ('as1MSP.member', 'as2MSP.member')"
