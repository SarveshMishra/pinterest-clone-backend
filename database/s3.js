require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const s3 = new S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_BUCKET_REGION,
});
// Function to upload file to S3 bucket
const uploadFile = async (file) => {
	const fileStream = fs.createReadStream(file.path);

	const uploadParam = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: file.filename,
		Body: fileStream,
	};

	const result = await s3.upload(uploadParam).promise();
	return result;
};

// Function to download file from S3 bucket
const downloadFile = async (key) => {
	const downloadParam = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: key,
	};

	const result = await s3.getObject(downloadParam).createReadStream();
	return result;
};

module.exports = {
	uploadFile,
	downloadFile,
};
