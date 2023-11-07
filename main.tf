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

resource "null_resource" "kubeconfig" {
  depends_on = [scaleway_k8s_pool.gamefuse-pool]
  triggers = {
    host                   = scaleway_k8s_cluster.gamefuse-cluster.kubeconfig[0].host
    token                  = scaleway_k8s_cluster.gamefuse-cluster.kubeconfig[0].token
    cluster_ca_certificate = scaleway_k8s_cluster.gamefuse-cluster.kubeconfig[0].cluster_ca_certificate
  }
}

resource "local_file" "kubeconfig" {
  content  = scaleway_k8s_cluster.gamefuse-cluster.kubeconfig[0].config_file
  filename = "kubeconfig.yaml"
}

provider "kubernetes" {
  host  = null_resource.kubeconfig.triggers.host
  token = null_resource.kubeconfig.triggers.token
  cluster_ca_certificate = base64decode(
    null_resource.kubeconfig.triggers.cluster_ca_certificate
  )
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

resource "kubernetes_service" "gamefuse-loadbalancer" {
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