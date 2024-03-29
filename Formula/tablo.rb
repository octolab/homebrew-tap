# This file was generated by GoReleaser. DO NOT EDIT.
class Tablo < Formula
  desc "The one point of view to all your task boards."
  homepage "https://github.com/octopot/tablo"
  version "0.0.1"
  bottle :unneeded

  if OS.mac?
    url "https://github.com/octopot/tablo/releases/download/v0.0.1/tablo_0.0.1_macOS-64bit.tar.gz"
    sha256 "fed908f8ed2618ec5c8e01e66586d6562b6ecac4aa19fe85ce92cab250f5ced4"
  elsif OS.linux?
    if Hardware::CPU.intel?
      url "https://github.com/octopot/tablo/releases/download/v0.0.1/tablo_0.0.1_Linux-64bit.tar.gz"
      sha256 "cc1a9a4cbcf69b29d23c21770b3f11d33261098d77492a705e1677c675e61ce8"
    end
  end

  def install
    bin.install "tablo"
    output = Utils.popen_read("#{bin}/tablo completion bash")
    (bash_completion/"tablo").write output
    output = Utils.popen_read("#{bin}/tablo completion zsh")
    (zsh_completion/"_tablo").write output
    
    bin.install "tabloctl"
    output = Utils.popen_read("#{bin}/tabloctl completion bash")
    (bash_completion/"tabloctl").write output
    output = Utils.popen_read("#{bin}/tabloctl completion zsh")
    (zsh_completion/"_tabloctl").write output
    
    prefix.install_metafiles
  end

  test do
    system "#{bin}/tablo    version"
    system "#{bin}/tabloctl version"
  end
end
