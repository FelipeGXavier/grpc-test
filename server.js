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

const GetAddress = (call, callback) => {
    callback(null, {date: new Date().getTime().toString(), address: "Teste"});
}

function main() {
    const server = new grpc.Server();
    const grpService = grpc.loadPackageDefinition(packageDefinition).localization;
    server.addService(grpService.Localization.service, { GetAddress });
    server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
      server.start();
    });
}

main();

