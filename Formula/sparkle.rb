# typed: false
# frozen_string_literal: true

# This file was generated by GoReleaser. DO NOT EDIT.
class Sparkle < Formula
  desc "✨ Sparkle service. The personal development framework
and Personal Knowledge Management platform.
"
  homepage "https://sparkle.wiki/"
  version "0.3.1"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/withsparkle/service/releases/download/v0.3.1/sparkle_0.3.1_darwin-arm64.tar.gz"
      sha256 "b073a9956b722a1d2f7d8b40a105c001c1900fa8356367617e4d6d9fbfc9cd84"

      def install
        bin.install "sparkle"
        output = Utils.popen_read("#{bin}/sparkle completion bash")
        (bash_completion/"sparkle").write output
        output = Utils.popen_read("#{bin}/sparkle completion fish")
        (fish_completion/"sparkle.fish").write output
        output = Utils.popen_read("#{bin}/sparkle completion zsh")
        (zsh_completion/"_sparkle").write output

        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/withsparkle/service/releases/download/v0.3.1/sparkle_0.3.1_darwin-amd64.tar.gz"
      sha256 "5e5d64907831b2e957e6d770396ff6c345643cd10b130cbd292929fc6f06afb5"

      def install
        bin.install "sparkle"
        output = Utils.popen_read("#{bin}/sparkle completion bash")
        (bash_completion/"sparkle").write output
        output = Utils.popen_read("#{bin}/sparkle completion fish")
        (fish_completion/"sparkle.fish").write output
        output = Utils.popen_read("#{bin}/sparkle completion zsh")
        (zsh_completion/"_sparkle").write output

        prefix.install_metafiles
      end
    end
  end

  on_linux do
    if Hardware::CPU.arm? && Hardware::CPU.is_64_bit?
      url "https://github.com/withsparkle/service/releases/download/v0.3.1/sparkle_0.3.1_linux-arm64.tar.gz"
      sha256 "86324a5ea977cae0c496f24fbddfc69f721953d8a114ddd00bbf7087762e4e91"

      def install
        bin.install "sparkle"
        output = Utils.popen_read("#{bin}/sparkle completion bash")
        (bash_completion/"sparkle").write output
        output = Utils.popen_read("#{bin}/sparkle completion fish")
        (fish_completion/"sparkle.fish").write output
        output = Utils.popen_read("#{bin}/sparkle completion zsh")
        (zsh_completion/"_sparkle").write output

        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/withsparkle/service/releases/download/v0.3.1/sparkle_0.3.1_linux-amd64.tar.gz"
      sha256 "7b516a9bcf57c4aef9191f4133e2e73683973de9295606f552c9cf34b44205a3"

      def install
        bin.install "sparkle"
        output = Utils.popen_read("#{bin}/sparkle completion bash")
        (bash_completion/"sparkle").write output
        output = Utils.popen_read("#{bin}/sparkle completion fish")
        (fish_completion/"sparkle.fish").write output
        output = Utils.popen_read("#{bin}/sparkle completion zsh")
        (zsh_completion/"_sparkle").write output

        prefix.install_metafiles
      end
    end
  end

  test do
    system "#{bin}/sparkle version"
  end
end
