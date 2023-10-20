# typed: false
# frozen_string_literal: true

# This file was generated by GoReleaser. DO NOT EDIT.
class GolangciLint < Formula
  desc "Fast linters runner for Go."
  homepage "https://golangci-lint.octolab.org/"
  version "1.55.0"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/kamilsk/golangci-lint/releases/download/v1.55.0/golangci-lint_1.55.0_darwin-arm64.tar.gz"
      sha256 "5861e7ffb1aea6eb30bb923a9d31c964a12c685b6bc047426f659cb195e97004"

      def install
        bin.install "golangci-lint"

        output = Utils.popen_read("#{bin}/golangci-lint completion bash")
        (bash_completion/"golangci-lint").write output

        output = Utils.popen_read("#{bin}/golangci-lint completion fish")
        (fish_completion/"golangci-lint.fish").write output

        output = Utils.popen_read("#{bin}/golangci-lint completion zsh")
        (zsh_completion/"_golangci-lint").write output

        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/kamilsk/golangci-lint/releases/download/v1.55.0/golangci-lint_1.55.0_darwin-amd64.tar.gz"
      sha256 "3e28779330b9a90134c7f1585650878cd3bf550a6703be5e57697dadf89dc828"

      def install
        bin.install "golangci-lint"

        output = Utils.popen_read("#{bin}/golangci-lint completion bash")
        (bash_completion/"golangci-lint").write output

        output = Utils.popen_read("#{bin}/golangci-lint completion fish")
        (fish_completion/"golangci-lint.fish").write output

        output = Utils.popen_read("#{bin}/golangci-lint completion zsh")
        (zsh_completion/"_golangci-lint").write output

        prefix.install_metafiles
      end
    end
  end

  on_linux do
    if Hardware::CPU.arm? && Hardware::CPU.is_64_bit?
      url "https://github.com/kamilsk/golangci-lint/releases/download/v1.55.0/golangci-lint_1.55.0_linux-arm64.tar.gz"
      sha256 "25a1358083b1e168bca31c78a7a14b483f5bfba1d0ffdd860c88105a38fbb700"

      def install
        bin.install "golangci-lint"

        output = Utils.popen_read("#{bin}/golangci-lint completion bash")
        (bash_completion/"golangci-lint").write output

        output = Utils.popen_read("#{bin}/golangci-lint completion fish")
        (fish_completion/"golangci-lint.fish").write output

        output = Utils.popen_read("#{bin}/golangci-lint completion zsh")
        (zsh_completion/"_golangci-lint").write output

        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/kamilsk/golangci-lint/releases/download/v1.55.0/golangci-lint_1.55.0_linux-amd64.tar.gz"
      sha256 "4be8ad0c796bf2b5ddf26c5e742c735b10e9d76b265e76989109871199c0c6da"

      def install
        bin.install "golangci-lint"

        output = Utils.popen_read("#{bin}/golangci-lint completion bash")
        (bash_completion/"golangci-lint").write output

        output = Utils.popen_read("#{bin}/golangci-lint completion fish")
        (fish_completion/"golangci-lint.fish").write output

        output = Utils.popen_read("#{bin}/golangci-lint completion zsh")
        (zsh_completion/"_golangci-lint").write output

        prefix.install_metafiles
      end
    end
  end

  test do
    system "#{bin}/golangci-lint version"
  end
end
