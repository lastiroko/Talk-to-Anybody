/**
 * Generate an S3 presigned URL for audio upload.
 * TODO: Implement with AWS SDK v3 (@aws-sdk/s3-request-presigner)
 */
export async function generatePresignedUploadUrl(
  bucket: string,
  key: string,
  contentType: string = 'audio/m4a',
  expiresInSeconds: number = 3600
): Promise<string> {
  // TODO: implement with @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner
  // const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  // return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
  return `https://${bucket}.s3.amazonaws.com/${key}?stub=true`;
}
