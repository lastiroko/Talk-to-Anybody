import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let s3Client: S3Client | null = null;

function getS3Client(config: {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_ENDPOINT_URL_S3: string;
}): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: config.AWS_REGION || 'auto',
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
      ...(config.AWS_ENDPOINT_URL_S3 ? { endpoint: config.AWS_ENDPOINT_URL_S3, forcePathStyle: true } : {}),
    });
  }
  return s3Client;
}

export async function generatePresignedUploadUrl(
  bucket: string,
  key: string,
  config: {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    AWS_ENDPOINT_URL_S3: string;
  },
  contentType: string = 'audio/m4a',
  expiresInSeconds: number = 3600,
): Promise<string> {
  const client = getS3Client(config);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

export async function generatePresignedDownloadUrl(
  bucket: string,
  key: string,
  config: {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    AWS_ENDPOINT_URL_S3: string;
  },
  expiresInSeconds: number = 3600,
): Promise<string> {
  const client = getS3Client(config);
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}
