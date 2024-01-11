terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.24.0"
    }
  }
}

resource "kubernetes_secret" "registry" {
  metadata {
    name = "registry-cfg"
  }

  type = "kubernetes.io/dockerconfigjson"

  data = {
    ".dockerconfigjson" = jsonencode({
      auths = {
        "rg.fr-par.scw.cloud" = {
          "username" = var.REGISTRY_USERNAME
          "password" = var.SCW_SECRET_KEY
          "auth"     = base64encode("${var.REGISTRY_USERNAME}:${var.SCW_SECRET_KEY}")
        }
      }
    })
  }
}

resource "kubernetes_deployment" "gamefuse-api" {
  metadata {
    name   = "gamefuse-api"
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
          image             = "rg.fr-par.scw.cloud/gamefuse/gamefuse_api:latest"
          name              = "gamefuse-container"
          image_pull_policy = "Always"

          resources {
            limits = {
              cpu    = "0.5"
              memory = "512Mi"
            }
            requests = {
              cpu    = "250m"
              memory = "50Mi"
            }
          }

          port {
            container_port = 3000
          }

          env {
            name  = "AWS_ACCESS_KEY_ID"
            value = var.SCW_ACCESS_KEY
          }

          env {
            name  = "AWS_SECRET_ACCESS_KEY"
            value = var.SCW_SECRET_KEY
          }

          env {
            name  = "AWS_REGION"
            value = var.BUCKET_REGION
          }

          env {
            name  = "AWS_BUCKET_NAME"
            value = var.BUCKET_NAME
          }

          env {
            name  = "BUCKET_DOMAIN"
            value = "scw.cloud"
          }

          env {
            name  = "MONGO_URI"
            value = "mongodb://gamefuse-database-service:27017/gamefuse"
          }

          env {
            name  = "MAILJET_API_KEY"
            value = var.MAILJET_API_KEY
          }

          env {
            name  = "MAILJET_API_SECRET"
            value = var.MAILJET_API_SECRET
          }

          env {
            name  = "MAILJET_EMAIL_FROM"
            value = var.MAILJET_EMAIL_FROM
          }

          env {
            name  = "JWT_SECRET"
            value = var.JWT_SECRET
          }

          env {
            name  = "JWT_EXPIRATION"
            value = var.JWT_EXPIRATION
          }
        }

        image_pull_secrets {
          name = "registry-cfg"
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

resource "kubernetes_horizontal_pod_autoscaler" "gamefuse-api-hpa" {
  metadata {
    name = "gamefuse-api-hpa"
  }

  spec {
    max_replicas = 5
    min_replicas = 1

    target_cpu_utilization_percentage = 50

    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = "gamefuse-api"
    }
  }
}