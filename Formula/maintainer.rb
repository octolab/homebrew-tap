# typed: false
# frozen_string_literal: true

# This file was generated by GoReleaser. DO NOT EDIT.
class Maintainer < Formula
  desc "Maintainer is an indispensable assistant to Open Source contribution."
  homepage "https://github.com/octomation/maintainer"
  version "0.1.0-rc3"

  on_macos do
    if Hardware::CPU.intel?
      url "https://github.com/octomation/maintainer/releases/download/v0.1.0-rc3/maintainer_0.1.0-rc3_macOS-64bit_x86.tar.gz"
      sha256 "f6469158f7d416e69bcbc58279812e41634478f6c66c0444bc86cce6597a1acd"

      def install
        bin.install "maintainer"

        output = Utils.popen_read("#{bin}/maintainer completion bash")
        (bash_completion/"maintainer").write output

        output = Utils.popen_read("#{bin}/maintainer completion fish")
        (fish_completion/"maintainer.fish").write output

        output = Utils.popen_read("#{bin}/maintainer completion zsh")
        (zsh_completion/"_maintainer").write output

        prefix.install_metafiles
      end
    end
    if Hardware::CPU.arm?
      url "https://github.com/octomation/maintainer/releases/download/v0.1.0-rc3/maintainer_0.1.0-rc3_macOS-64bit_arm.tar.gz"
      sha256 "00e9af35168712ce9012ca37b3eabc2d29803006770518ab9dda701eddb83d68"

      def install
        bin.install "maintainer"

        output = Utils.popen_read("#{bin}/maintainer completion bash")
        (bash_completion/"maintainer").write output

        output = Utils.popen_read("#{bin}/maintainer completion fish")
        (fish_completion/"maintainer.fish").write output

        output = Utils.popen_read("#{bin}/maintainer completion zsh")
        (zsh_completion/"_maintainer").write output

        prefix.install_metafiles
      end
    end
  end

  on_linux do
    if Hardware::CPU.intel?
      url "https://github.com/octomation/maintainer/releases/download/v0.1.0-rc3/maintainer_0.1.0-rc3_Linux-64bit_x86.tar.gz"
      sha256 "9b82072da097282ce61a1935d0f49ad5f4d20c6c9a25e7ead0001ab490dc3001"

      def install
        bin.install "maintainer"

        output = Utils.popen_read("#{bin}/maintainer completion bash")
        (bash_completion/"maintainer").write output

        output = Utils.popen_read("#{bin}/maintainer completion fish")
        (fish_completion/"maintainer.fish").write output

        output = Utils.popen_read("#{bin}/maintainer completion zsh")
        (zsh_completion/"_maintainer").write output

        prefix.install_metafiles
      end
    end
    if Hardware::CPU.arm? && Hardware::CPU.is_64_bit?
      url "https://github.com/octomation/maintainer/releases/download/v0.1.0-rc3/maintainer_0.1.0-rc3_Linux-64bit_arm.tar.gz"
      sha256 "ada6c40c5c364ea9a69e1178fde8f0a11c6384fa284941f1a0a2c2fb596c1214"

      def install
        bin.install "maintainer"

        output = Utils.popen_read("#{bin}/maintainer completion bash")
        (bash_completion/"maintainer").write output

        output = Utils.popen_read("#{bin}/maintainer completion fish")
        (fish_completion/"maintainer.fish").write output

        output = Utils.popen_read("#{bin}/maintainer completion zsh")
        (zsh_completion/"_maintainer").write output

        prefix.install_metafiles
      end
    end
  end

  test do
    system "#{bin}/maintainer version"
  end
end
