# typed: false
# frozen_string_literal: true

# This file was generated by GoReleaser. DO NOT EDIT.
class Maintainer < Formula
  desc "Maintainer is an indispensable assistant to Open Source contribution."
  homepage "https://github.com/octomation/maintainer"
  version "0.1.0-rc2"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/octomation/maintainer/releases/download/v0.1.0-rc2/maintainer_0.1.0-rc2_macOS-64bit_arm.tar.gz"
      sha256 "1b4d2d5a43154ff53e10e5caede2ba3d5f619a8d97ec06b6d10a79cea8be7e8a"

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
    if Hardware::CPU.intel?
      url "https://github.com/octomation/maintainer/releases/download/v0.1.0-rc2/maintainer_0.1.0-rc2_macOS-64bit_x86.tar.gz"
      sha256 "d3914807cfcfd7b40c63cb3a09f8a393bb469162a1c510d9bb8a41bb63e9a423"

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
    if Hardware::CPU.arm? && Hardware::CPU.is_64_bit?
      url "https://github.com/octomation/maintainer/releases/download/v0.1.0-rc2/maintainer_0.1.0-rc2_Linux-64bit_arm.tar.gz"
      sha256 "8639357025c08816d826e2e120e8aedd02cc5c2e2ce27b342ed7cd7d979b1600"

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
    if Hardware::CPU.intel?
      url "https://github.com/octomation/maintainer/releases/download/v0.1.0-rc2/maintainer_0.1.0-rc2_Linux-64bit_x86.tar.gz"
      sha256 "d161dcc32b3c16fc38008ab34055ce6d22bda7b1b74ac91f7a11ef065e8e5c00"

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
