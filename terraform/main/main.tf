terraform {
  required_providers {
    scaleway = {
      source = "scaleway/scaleway"
      version = "2.31.0"
    }

    local = {
      source = "hashicorp/local"
      version = "2.4.0"
    }

    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "2.23.0"
    }
  }

  backend "s3" {
    bucket = "gamefuse-terraform-state"
    key    = "gamefuse-terraform.tfstate"
    endpoint = "https://s3.fr-par.scw.cloud"
    region = "fr-par"
    skip_credentials_validation = true
    skip_region_validation = true
    skip_requesting_account_id = true
  }
}

provider "scaleway" {}

module "object_storage" {
  source = "./object_storage"
}

module "kubernetes_cluster" {
  source = "./kubernetes_cluster"
}

provider "kubernetes" {
  host  = module.kubernetes_cluster.kubeconfig_host
  token = module.kubernetes_cluster.kubeconfig_token
  cluster_ca_certificate = base64decode(
    module.kubernetes_cluster.kubeconfig_cluster_ca_certificate,
  )
}

module "database_deployment" {
  source = "./database_deployment"
}

variable "SCW_ACCESS_KEY" {
  type = string
}

variable "SCW_SECRET_KEY" {
  type = string
}

module "api_deployment" {
  source = "./api_deployment"
  SCW_ACCESS_KEY = var.SCW_ACCESS_KEY
  SCW_SECRET_KEY = var.SCW_SECRET_KEY
  BUCKET_NAME = module.object_storage.bucket_name
  BUCKET_REGION = module.object_storage.bucket_region
}