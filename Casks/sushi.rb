cask "sushi" do
  version "0.2.1"
  sha256 "e3cff1e5f672d8dbb0a5bb959f9c7418f202349710e44fe548b51b670f190141"

  url "https://github.com/octopot/sushi/releases/download/v#{version}/sushi_#{version}_darwin-arm64.zip"
  name "Sushi"
  desc "Prompt composer with local model rewrites"
  homepage "https://sushi.octolab.org/"

  livecheck do
    url :url
    strategy :github_latest
  end

  depends_on arch: :arm64
  depends_on macos: :tahoe

  app "Sushi.app"

  # The app is ad-hoc signed, not notarized: Gatekeeper refuses it while it
  # carries the quarantine attribute Homebrew sets on every download.
  preflight_steps do
    run "/usr/bin/xattr", args: ["-dr", "com.apple.quarantine", "{{staged_path}}/Sushi.app"]
  end

  uninstall quit: "me.octopot.sushi"

  # me.octopot.susi: left by Susi, the app's name before v0.2.0, and kept by the move to Sushi.
  zap trash: [
    "~/Library/Application Support/me.octopot.sushi",
    "~/Library/Application Support/me.octopot.susi",
    "~/Library/Caches/me.octopot.sushi",
    "~/Library/Caches/me.octopot.susi",
    "~/Library/WebKit/me.octopot.sushi",
    "~/Library/WebKit/me.octopot.susi",
  ]

  # Install steps run in Homebrew's sandbox, which cannot launch apps, and an
  # upgrade from Susi reopens nothing: Homebrew reopens by the old bundle ID.
  caveats <<~EOS
    Sushi lives in the menu bar. If it is not running, start it with:
      open -a Sushi
    It rewrites text with a local Ollama model. Install Ollama, then run once:
      ollama pull qwen3.5:4b-mlx
  EOS
end
