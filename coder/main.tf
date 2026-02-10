# Example App - TanStack Start demo for codespace.sh
# Consumes the dind template module

module "workspace" {
  source = "git::https://github.com/codespacesh/templates.git//dind/module"

  project_name = "example"
  git_repos    = { "example" = "https://github.com/codespacesh/example" }

  services = {
    app = { port = 5173, public = true, healthcheck = true, healthcheck_path = "/healthz" }
  }

  extra_env = {
    GH_TOKEN = var.gh_token
  }

  git_setup_hook = <<-EOF
    echo "https://oauth2:${var.gh_token}@github.com" >> ~/.git-credentials
  EOF
}

variable "gh_token" {
  description = "GitHub token for gh CLI and git push"
  type        = string
  sensitive   = true
  default     = ""
}
