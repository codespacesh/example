# Example App - TanStack Start demo for codespace.sh
# Consumes the dind template module

module "workspace" {
  source = "git::https://github.com/codespacesh/templates.git//dind/module"

  project_name    = "example"
  git_repos       = { "example" = "https://github.com/codespacesh/example" }
  install_command = "bun install"

  services = {
    app = { port = 5173, public = true, healthcheck = true }
  }
}
