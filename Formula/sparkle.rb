# typed: false
# frozen_string_literal: true

# This file was generated by GoReleaser. DO NOT EDIT.
class Sparkle < Formula
  desc "✨ Sparkle service."
  homepage "https://sparkle.wiki/"
  version "0.0.2"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/withsparkle/service/releases/download/v0.0.2/sparkle_0.0.2_darwin-arm64.tar.gz"
      sha256 "9e061a759fa0938365bb70964097662f3ac081c733e10b2b63c0325dac4d3842"

      def install
        bin.install "sparkle"

        output = Utils.popen_read("#{bin}/sparkle completion bash")
        (bash_completion/"sparkle").write output

        output = Utils.popen_read("#{bin}/sparkle completion fish")
        (fish_completion/"sparkle.fish").write output

        output = Utils.popen_read("#{bin}/sparkle completion zsh")
        (zsh_completion/"_sparkle").write output

        bin.install "sparklectl"

        output = Utils.popen_read("#{bin}/sparklectl completion bash")
        (bash_completion/"sparklectl").write output

        output = Utils.popen_read("#{bin}/sparklectl completion fish")
        (fish_completion/"sparklectl.fish").write output

        output = Utils.popen_read("#{bin}/sparklectl completion zsh")
        (zsh_completion/"_sparklectl").write output

        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/withsparkle/service/releases/download/v0.0.2/sparkle_0.0.2_darwin-amd64.tar.gz"
      sha256 "a056a4fada49aff642766d77971c433056b9b39bcc93b322f045f672ac1de103"

      def install
        bin.install "sparkle"

        output = Utils.popen_read("#{bin}/sparkle completion bash")
        (bash_completion/"sparkle").write output

        output = Utils.popen_read("#{bin}/sparkle completion fish")
        (fish_completion/"sparkle.fish").write output

        output = Utils.popen_read("#{bin}/sparkle completion zsh")
        (zsh_completion/"_sparkle").write output

        bin.install "sparklectl"

        output = Utils.popen_read("#{bin}/sparklectl completion bash")
        (bash_completion/"sparklectl").write output

        output = Utils.popen_read("#{bin}/sparklectl completion fish")
        (fish_completion/"sparklectl.fish").write output

        output = Utils.popen_read("#{bin}/sparklectl completion zsh")
        (zsh_completion/"_sparklectl").write output

        prefix.install_metafiles
      end
    end
  end

  on_linux do
    if Hardware::CPU.arm? && Hardware::CPU.is_64_bit?
      url "https://github.com/withsparkle/service/releases/download/v0.0.2/sparkle_0.0.2_linux-arm64.tar.gz"
      sha256 "0cec40ae2e894b8a4536477100ee67fc4d7f6481f465ca47ce6be8d2453d167d"

      def install
        bin.install "sparkle"

        output = Utils.popen_read("#{bin}/sparkle completion bash")
        (bash_completion/"sparkle").write output

        output = Utils.popen_read("#{bin}/sparkle completion fish")
        (fish_completion/"sparkle.fish").write output

        output = Utils.popen_read("#{bin}/sparkle completion zsh")
        (zsh_completion/"_sparkle").write output

        bin.install "sparklectl"

        output = Utils.popen_read("#{bin}/sparklectl completion bash")
        (bash_completion/"sparklectl").write output

        output = Utils.popen_read("#{bin}/sparklectl completion fish")
        (fish_completion/"sparklectl.fish").write output

        output = Utils.popen_read("#{bin}/sparklectl completion zsh")
        (zsh_completion/"_sparklectl").write output

        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/withsparkle/service/releases/download/v0.0.2/sparkle_0.0.2_linux-amd64.tar.gz"
      sha256 "757c698430e817d2d84114a977ffcc6b15881e3fcd2f8816398aa31fd8102751"

      def install
        bin.install "sparkle"

        output = Utils.popen_read("#{bin}/sparkle completion bash")
        (bash_completion/"sparkle").write output

        output = Utils.popen_read("#{bin}/sparkle completion fish")
        (fish_completion/"sparkle.fish").write output

        output = Utils.popen_read("#{bin}/sparkle completion zsh")
        (zsh_completion/"_sparkle").write output

        bin.install "sparklectl"

        output = Utils.popen_read("#{bin}/sparklectl completion bash")
        (bash_completion/"sparklectl").write output

        output = Utils.popen_read("#{bin}/sparklectl completion fish")
        (fish_completion/"sparklectl.fish").write output

        output = Utils.popen_read("#{bin}/sparklectl completion zsh")
        (zsh_completion/"_sparklectl").write output

        prefix.install_metafiles
      end
    end
  end

  test do
    system "#{bin}/sparkle    version"
    system "#{bin}/sparklectl version"
  end
end