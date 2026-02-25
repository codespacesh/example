# Example App - TanStack Start demo for codespace.sh
# Consumes the dind template module

variable "claude_code_oauth_token" {
  type      = string
  sensitive = true
  default   = ""
}

module "workspace" {
  source = "git::https://github.com/codespacesh/templates.git//dind/module?ref=v1.1.10"

  project_name           = "example"
  git_repos              = { "example" = "https://github.com/codespacesh/example" }
  claude_code_oauth_token = var.claude_code_oauth_token

  services = {
    app = { port = 5173, public = true, healthcheck = true, healthcheck_path = "/healthz" }
  }
}
