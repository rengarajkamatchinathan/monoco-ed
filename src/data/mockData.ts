export const mockTerraformData = {
  version: "1.0.0",
  timestamp: "2024-01-15T10:30:00Z",
  request_id: "req_123456789",
  status: "success",
  cloud_provider: "azure",
  infrastructure: {
    "main.tf": {
      content: `# Configure the Azure Provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
}

# Create a resource group
resource "azurerm_resource_group" "main" {
  name     = "rg-infragenie-demo"
  location = "East US"

  tags = {
    Environment = "Development"
    Project     = "InfraGenie"
    CreatedBy   = "Terraform"
  }
}

# Create a virtual network
resource "azurerm_virtual_network" "main" {
  name                = "vnet-infragenie"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = {
    Environment = "Development"
    Project     = "InfraGenie"
  }
}

# Create a subnet
resource "azurerm_subnet" "internal" {
  name                 = "subnet-internal"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}`,
      purpose: "Main Terraform configuration file",
      dependencies: []
    },
    "variables.tf": {
      content: `# Input variable definitions

variable "resource_group_location" {
  description = "Location of the resource group."
  type        = string
  default     = "East US"
}

variable "resource_group_name_prefix" {
  description = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
  type        = string
  default     = "rg"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "Development"
  
  validation {
    condition     = contains(["Development", "Staging", "Production"], var.environment)
    error_message = "Environment must be Development, Staging, or Production."
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "InfraGenie"
}

variable "tags" {
  description = "A map of tags to assign to the resource"
  type        = map(string)
  default = {
    Environment = "Development"
    Project     = "InfraGenie"
    CreatedBy   = "Terraform"
  }
}`,
      purpose: "Variable definitions for the Terraform configuration",
      dependencies: []
    },
    "outputs.tf": {
      content: `# Output value definitions

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = azurerm_resource_group.main.location
}

output "virtual_network_name" {
  description = "Name of the virtual network"
  value       = azurerm_virtual_network.main.name
}

output "virtual_network_id" {
  description = "ID of the virtual network"
  value       = azurerm_virtual_network.main.id
}

output "subnet_id" {
  description = "ID of the subnet"
  value       = azurerm_subnet.internal.id
}

output "subnet_name" {
  description = "Name of the subnet"
  value       = azurerm_subnet.internal.name
}`,
      purpose: "Output definitions for the Terraform configuration",
      dependencies: ["main.tf"]
    },
    "terraform.tfvars": {
      content: `# Terraform variable values

resource_group_location     = "East US"
resource_group_name_prefix  = "rg-infragenie"
environment                 = "Development"
project_name               = "InfraGenie Demo"

tags = {
  Environment = "Development"
  Project     = "InfraGenie"
  CreatedBy   = "Terraform"
  Owner       = "DevOps Team"
  CostCenter  = "Engineering"
}`,
      purpose: "Variable values for the Terraform configuration",
      dependencies: ["variables.tf"]
    }
  }
};