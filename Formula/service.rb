# typed: false
# frozen_string_literal: true

# This file was generated by GoReleaser. DO NOT EDIT.
class Service < Formula
  desc "Template for a typical service written on Go."
  homepage "https://go-service.octolab.org/"
  version "1.0.0-rc1"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/octomation/go-service/releases/download/v1.0.0-rc1/service_1.0.0-rc1_darwin-arm64.tar.gz"
      sha256 "3a00b4a1380788b9953ea6c7f0b743520b289fa1285d96e8947943b1da676c19"

      def install
        bin.install "service"
        output = Utils.popen_read("#{bin}/server completion bash")
        (bash_completion/"server").write output
        output = Utils.popen_read("#{bin}/server completion fish")
        (fish_completion/"server.fish").write output
        output = Utils.popen_read("#{bin}/server completion zsh")
        (zsh_completion/"_server").write output

        bin.install "client"
        output = Utils.popen_read("#{bin}/client completion bash")
        (bash_completion/"client").write output
        output = Utils.popen_read("#{bin}/client completion fish")
        (fish_completion/"client.fish").write output
        output = Utils.popen_read("#{bin}/client completion zsh")
        (zsh_completion/"_client").write output
        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/octomation/go-service/releases/download/v1.0.0-rc1/service_1.0.0-rc1_darwin-amd64.tar.gz"
      sha256 "a578cb5e2df032dea3d630376004e97b097ea6dd3b415c73d9fec3a1a82bdcfd"

      def install
        bin.install "service"
        output = Utils.popen_read("#{bin}/server completion bash")
        (bash_completion/"server").write output
        output = Utils.popen_read("#{bin}/server completion fish")
        (fish_completion/"server.fish").write output
        output = Utils.popen_read("#{bin}/server completion zsh")
        (zsh_completion/"_server").write output

        bin.install "client"
        output = Utils.popen_read("#{bin}/client completion bash")
        (bash_completion/"client").write output
        output = Utils.popen_read("#{bin}/client completion fish")
        (fish_completion/"client.fish").write output
        output = Utils.popen_read("#{bin}/client completion zsh")
        (zsh_completion/"_client").write output
        prefix.install_metafiles
      end
    end
  end

  on_linux do
    if Hardware::CPU.arm? && Hardware::CPU.is_64_bit?
      url "https://github.com/octomation/go-service/releases/download/v1.0.0-rc1/service_1.0.0-rc1_linux-arm64.tar.gz"
      sha256 "d01ea03dbd2f4d7f8319f8b22ebb70d7cd821fc5c15eb83a492173eb137b8741"

      def install
        bin.install "service"
        output = Utils.popen_read("#{bin}/server completion bash")
        (bash_completion/"server").write output
        output = Utils.popen_read("#{bin}/server completion fish")
        (fish_completion/"server.fish").write output
        output = Utils.popen_read("#{bin}/server completion zsh")
        (zsh_completion/"_server").write output

        bin.install "client"
        output = Utils.popen_read("#{bin}/client completion bash")
        (bash_completion/"client").write output
        output = Utils.popen_read("#{bin}/client completion fish")
        (fish_completion/"client.fish").write output
        output = Utils.popen_read("#{bin}/client completion zsh")
        (zsh_completion/"_client").write output
        prefix.install_metafiles
      end
    end
    if Hardware::CPU.intel?
      url "https://github.com/octomation/go-service/releases/download/v1.0.0-rc1/service_1.0.0-rc1_linux-amd64.tar.gz"
      sha256 "c286049f224423998aae0ac7f07f9c6d7f7df98e8342ef60a3bd5ba583946c67"

      def install
        bin.install "service"
        output = Utils.popen_read("#{bin}/server completion bash")
        (bash_completion/"server").write output
        output = Utils.popen_read("#{bin}/server completion fish")
        (fish_completion/"server.fish").write output
        output = Utils.popen_read("#{bin}/server completion zsh")
        (zsh_completion/"_server").write output

        bin.install "client"
        output = Utils.popen_read("#{bin}/client completion bash")
        (bash_completion/"client").write output
        output = Utils.popen_read("#{bin}/client completion fish")
        (fish_completion/"client.fish").write output
        output = Utils.popen_read("#{bin}/client completion zsh")
        (zsh_completion/"_client").write output
        prefix.install_metafiles
      end
    end
  end

  def caveats
    <<~EOS
      An example of the goreleaser usage.
    EOS
  end

  test do
    system "#{bin}/server version"
    system "#{bin}/client version"
  end
end
