const grpc = require('@grpc/grpc-js');
const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const axios = require('axios').default;

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

const GetAddress = async (call, callback) => {
    const point = `${call.request.latitude}, ${call.request.longitude}`;
    const apiKey = "";
    const apiRequestUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${point}&pretty=1&no_annotations=1`;
    const response = await axios.get(apiRequestUrl);
    let address = "";
    if (response.data.results && response.data.results.length > 0) {
        address = response.data.results[0].formatted;
    }
    callback(null, {date: new Date().getTime().toString(), address});
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

