terraform {
  required_providers {
    scaleway = {
      source = "scaleway/scaleway"
      version = "2.29.0"
    }
  }
}

provider "scaleway" {}

resource "scaleway_object_bucket" "gamefuse-terraform-state" {
  name = "gamefuse-terraform-state"
  force_destroy = true
  region = "fr-par"
}