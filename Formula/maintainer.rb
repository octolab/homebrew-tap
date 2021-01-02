# This file was generated by GoReleaser. DO NOT EDIT.
class Maintainer < Formula
  desc "Maintainer is an indispensable assistant to Open Source contribution."
  homepage "https://github.com/octomation/maintainer"
  version "0.0.1"
  bottle :unneeded

  if OS.mac?
    url "https://github.com/octomation/maintainer/releases/download/v0.0.1/maintainer_0.0.1_macOS-64bit.tar.gz"
    sha256 "2f5bbe77548f2233cb4e39582489002c5f52c429a0c4609537a03825e8b6c584"
  end
  if OS.linux? && Hardware::CPU.intel?
    url "https://github.com/octomation/maintainer/releases/download/v0.0.1/maintainer_0.0.1_Linux-64bit.tar.gz"
    sha256 "ce7719e5a9c10f67f3be86fb4348be22a9867ef272c9ef79cba5f0a22da8fb3c"
  end

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

  test do
    system "#{bin}/maintainer version"
  end
end
