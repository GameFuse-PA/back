terraform {
  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "2.34.0"
    }

    local = {
      source  = "hashicorp/local"
      version = "2.4.1"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.24.0"
    }
  }

  backend "s3" {
    bucket                      = "gamefuse-terraform-state"
    key                         = "gamefuse-terraform.tfstate"
    endpoint                    = "https://s3.fr-par.scw.cloud"
    region                      = "fr-par"
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
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
  host                   = module.kubernetes_cluster.kubeconfig_host
  token                  = module.kubernetes_cluster.kubeconfig_token
  cluster_ca_certificate = base64decode(
    module.kubernetes_cluster.kubeconfig_cluster_ca_certificate,
  )
}

module "database_deployment" {
  source = "./database_deployment"
}

module "api_deployment" {
  source             = "./api_deployment"
  SCW_ACCESS_KEY     = var.SCW_ACCESS_KEY
  SCW_SECRET_KEY     = var.SCW_SECRET_KEY
  BUCKET_NAME        = module.object_storage.bucket_name
  BUCKET_REGION      = module.object_storage.bucket_region
  REGISTRY_USERNAME  = var.REGISTRY_USERNAME
  REGISTRY_URL       = var.REGISTRY_URL
  MAILJET_API_KEY    = var.MAILJET_API_KEY
  MAILJET_API_SECRET = var.MAILJET_API_SECRET
  MAILJET_EMAIL_FROM = var.MAILJET_EMAIL_FROM
  JWT_SECRET         = var.JWT_SECRET
  JWT_EXPIRATION     = var.JWT_EXPIRATION
}