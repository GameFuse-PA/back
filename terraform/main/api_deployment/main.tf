terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "2.23.0"
    }
  }
}

resource "kubernetes_deployment" "gamefuse-api" {
  metadata {
    name = "gamefuse-api"
    labels = {
      app = "gamefuse-api"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "gamefuse-api"
      }
    }

    template {
      metadata {
        labels = {
          app = "gamefuse-api"
        }
      }

      spec {
        container {
          image = "pbonnamy/gamefuse_api:latest"
          name  = "gamefuse-container"
          image_pull_policy = "Always"

          port {
            container_port = 3000
          }

          env {
            name = "AWS_ACCESS_KEY_ID"
            value = var.SCW_ACCESS_KEY
          }

          env {
            name = "AWS_SECRET_ACCESS_KEY"
            value = var.SCW_SECRET_KEY
          }

          env {
            name = "AWS_REGION"
            value = var.BUCKET_REGION
          }

          env {
            name = "AWS_BUCKET_NAME"
            value = var.BUCKET_NAME
          }

          env {
            name = "BUCKET_DOMAIN"
            value = "scw.cloud"
          }

          env {
            name = "MONGO_URI"
            value = "mongodb://gamefuse-database-service:27017/gamefuse"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "gamefuse-api-service" {
  metadata {
    name = "gamefuse-api-service"
  }

  spec {
    selector = {
      app = "gamefuse-api"
    }

    port {
      port        = 3000
      target_port = 3000
    }

    type = "LoadBalancer"
  }
}