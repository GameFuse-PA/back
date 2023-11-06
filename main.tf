terraform {
  required_providers {
    scaleway = {
      source = "scaleway/scaleway"
      version = "2.29.0"
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
}

provider "scaleway" {}

resource "scaleway_vpc_private_network" "gamefuse-network" {
  name = "gamefuse-network"
}

resource "scaleway_k8s_cluster" "gamefuse-cluster" {
  private_network_id = scaleway_vpc_private_network.gamefuse-network.id
  name    = "gamefuse-cluster"
  version = "1.24.3"
  cni     = "cilium"
  delete_additional_resources = false
}

resource "scaleway_k8s_pool" "gamefuse-pool" {
  cluster_id = scaleway_k8s_cluster.gamefuse-cluster.id
  name       = "gamefuse-pool"
  node_type  = "DEV1-M"
  size       = 1
}

resource "local_file" "kubeconfig" {
  content  = scaleway_k8s_cluster.gamefuse-cluster.kubeconfig[0].config_file
  filename = "kubeconfig.yaml"
}

provider "kubernetes" {
  config_path = local_file.kubeconfig.filename
}

resource "kubernetes_pod" "gamefuse-pod" {
  metadata {
    name = "gamefuse-pod"
    labels = {
      app = "gamefuse-pod"
    }
  }

  spec {
    container {
      image = "pbonnamy/gamefuse_api:release"
      name  = "gamefuse-container"

      port {
        container_port = 3000
      }
    }
  }
}

resource "kubernetes_service" "gamefuse-service" {
  metadata {
    name = "gamefuse-service"
  }

  spec {
    selector = {
      app = "gamefuse-pod"
    }

    port {
      port        = 3000
      target_port = 3000
    }

    type = "LoadBalancer"
  }
}