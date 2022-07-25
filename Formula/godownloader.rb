# typed: false
# frozen_string_literal: true

# This file was generated by GoReleaser. DO NOT EDIT.
class Godownloader < Formula
  desc "This is the inverse of goreleaser. The goreleaser YAML file is read and
creates a custom shell script that can download the right package and
the right version for the existing machine.
"
  homepage "https://github.com/kamilsk/godownloader"
  version "0.1.15"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/kamilsk/godownloader/releases/download/v0.1.15/godownloader_0.1.15_darwin-arm64.tar.gz"
      sha256 "2bcadfd43e8f33861708caaeaf75d2938ce398963a9d1d7205f5d10b029d77de"

      def install
        bin.install "godownloader"
        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/kamilsk/godownloader/releases/download/v0.1.15/godownloader_0.1.15_darwin-amd64.tar.gz"
      sha256 "7705827073a004457698fffeb7856b82894aec0d45320c5e4559daa92f73ed18"

      def install
        bin.install "godownloader"
        prefix.install_metafiles
      end
    end
  end

  on_linux do
    if Hardware::CPU.arm? && Hardware::CPU.is_64_bit?
      url "https://github.com/kamilsk/godownloader/releases/download/v0.1.15/godownloader_0.1.15_linux-arm64.tar.gz"
      sha256 "66374d8a5c441ad5219dd7b40255fae605ee59adb545a8a80da96aa5f7bc4bf1"

      def install
        bin.install "godownloader"
        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/kamilsk/godownloader/releases/download/v0.1.15/godownloader_0.1.15_linux-amd64.tar.gz"
      sha256 "389c040e2e7ff5de9a60012decb6a6f9c2aa778bac8c0a60831fd03653b55bc8"

      def install
        bin.install "godownloader"
        prefix.install_metafiles
      end
    end
  end

  test do
    system "#{bin}/godownloader --version"
  end
end
