cask "susi" do
  version "0.1.1"
  sha256 "6a0c4fcaf7837cccd9f63d8c4eaa3b511c43bde3cad792e66cf52402938fb0e2"

  url "https://github.com/octopot/susi/releases/download/v#{version}/susi_#{version}_darwin-arm64.zip"
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
