const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = path.resolve('./proto/localization.proto');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const grpService = grpc.loadPackageDefinition(packageDefinition).localization;

const client = new grpService.Localization('localhost:50051', grpc.credentials.createInsecure());

client.GetAddress({latitude: "0", longitude: "0"}, function(err, response) {
    console.log(response);
});