terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.24.0"
    }
  }
}

resource "kubernetes_deployment" "gamefuse-database" {
  metadata {
    name   = "gamefuse-database"
    labels = {
      app = "gamefuse-database"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "gamefuse-database"
      }
    }

    template {
      metadata {
        labels = {
          app = "gamefuse-database"
        }
      }

      spec {
        container {
          image             = "mongo:latest"
          name              = "mongodb-container"
          image_pull_policy = "Always"

          port {
            container_port = 27017
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "gamefuse-database-service" {
  metadata {
    name = "gamefuse-database-service"
  }

  spec {
    selector = {
      app = "gamefuse-database"
    }

    port {
      port        = 27017
      target_port = 27017
    }

    type = "ClusterIP"
  }
}