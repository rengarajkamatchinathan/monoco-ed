export interface TerraformFile {
  content: string;
  purpose: string;
  dependencies: string[];
}

export interface TerraformData {
  version: string;
  timestamp: string;
  request_id: string;
  status: string;
  cloud_provider: string;
  infrastructure: Record<string, TerraformFile>;
}