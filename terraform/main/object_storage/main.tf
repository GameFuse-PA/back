terraform {
  required_providers {
    scaleway = {
      source  = "scaleway/scaleway"
      version = "2.34.0"
    }
  }
}

resource "scaleway_object_bucket" "gamefuse-bucket" {
  name          = "gamefuse-bucket"
  force_destroy = true
  region        = "fr-par"
}