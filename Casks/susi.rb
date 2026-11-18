cask "susi" do
  version "0.1.0"
  sha256 "e6939a1b3e2a935274e6ec047810fad9389b1fa0a72323c75077521496971094"

  url "https://github.com/octopot/susi/releases/download/v#{version}/susi_#{version}_darwin-arm64.zip",
      verified: "github.com/octopot/susi/"
  name "Susi"
  desc "Prompt composer with local model rewrites"
  homepage "https://susi.octolab.org/"

  livecheck do
    url :url
    strategy :github_latest
  end

  depends_on arch: :arm64
  depends_on macos: :tahoe

  app "Susi.app"

  # The app is ad-hoc signed, not notarized: Gatekeeper refuses it while it
  # carries the quarantine attribute Homebrew sets on every download.
  preflight_steps do
    run "/usr/bin/xattr", args: ["-dr", "com.apple.quarantine", "{{staged_path}}/Susi.app"]
  end

  uninstall quit: "me.octopot.susi"

  zap trash: [
    "~/Library/Application Support/me.octopot.susi",
    "~/Library/Caches/me.octopot.susi",
    "~/Library/WebKit/me.octopot.susi",
  ]

  caveats <<~EOS
    Susi rewrites text with a local Ollama model. Install Ollama, then run once:
      ollama pull qwen3.5:4b-mlx
  EOS
end
