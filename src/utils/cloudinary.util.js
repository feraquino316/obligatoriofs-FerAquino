const { PassThrough } = require("stream");

function uploadBufferToCloudinary(cloudinaryinstance, buffer, options = {}){
    return new Promise((resolve, reject) => {
        const passThrough = new PassThrough();
        const stream = cloudinaryinstance.uploader.upload_stream(options, (error, result) => {
            if (error) { 
                return reject(error);
            }
            resolve(result);
        });
        passThrough.end(buffer);
        passThrough.pipe(stream);
    });
}

module.exports = { uploadBufferToCloudinary };