export function obtainFormData(file: File, presignedLinkFields: {key: string; AWSAccessKeyId: string; presignedLinkFields: string; "x-amz-security-token": string; policy: string; signature: string;}) {
  const formData = new FormData();
  formData.append("key", presignedLinkFields.key);
  formData.append("AWSAccessKeyId", presignedLinkFields.AWSAccessKeyId);
  formData.append("x-amz-security-token", presignedLinkFields["x-amz-security-token"]);
  formData.append("policy", presignedLinkFields.policy);
  formData.append("signature", presignedLinkFields.signature);
  formData.append("file", file);
  return formData;
}