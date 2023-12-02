output "kubeconfig_host" {
  value = null_resource.kubeconfig.triggers.host
}

output "kubeconfig_token" {
  value = null_resource.kubeconfig.triggers.token
}

output "kubeconfig_cluster_ca_certificate" {
  value = null_resource.kubeconfig.triggers.cluster_ca_certificate
}