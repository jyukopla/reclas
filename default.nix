{ rev ? "3a4e2376e444fd7664102af00a34c65b47e271ec"
, sha256 ? "1ab6b42hzc4ylyn6wi84y32idgykfvz8vi6dbr1cqykcl6n8s6iz"
, pkgs ? import ((import <nixpkgs> {}).pkgs.fetchFromGitHub {
    owner = "NixOS";
    repo = "nixpkgs-channels";
    inherit rev;
    inherit sha256;
  }) {}
, pythonPackages ? pkgs.python27Packages
}:

with pkgs;

let self = rec {
  pillow = pythonPackages.pillow.overrideDerivation(old: {
    name = "Pillow-3.4.1";
    src = fetchurl {
      url = "https://pypi.python.org/packages/35/a7/630d7c74970ee4fc95b6093191bbfd09a2738793200089c72fa9931c58fd/Pillow-3.4.1.zip";
      sha256 = "efae273173ea264e513b2931bdf5a5110cf1ed355e238605957b59ab0dcd9963";
    };
    nativeBuildInputs = old.nativeBuildInputs ++ [ unzip ];
  });
  libmc = pythonPackages.buildPythonPackage {
    name = "libmc-1.1.0";
    src = fetchurl {
      url = "https://pypi.python.org/packages/2f/94/65bd2233f7ae6d4ae4b8d3f3548847b2fd221d31173da953e845e54ea932/libmc-1.1.0.tar.gz";
      sha256 = "62778fac933bd7d351f580bf562e2955f2b1996bce75b32026885c9063653cbb";
    };
    buildInputs = [
      zlib
      pythonPackages.cython
    ];
    doCheck = false;
  };
  buildout = pythonPackages.zc_buildout_nix.overrideDerivation (old: {
    name = "zc.buildout-2.9.2";
    src = fetchurl {
      url = "https://pypi.python.org/packages/d9/a7/e0d48d47c5c71df71cdef6522c6287d304ef64d1c1f241a106b57b6a2b94/zc.buildout-2.9.2.tar.gz";
      sha256 = "513916fef5a99db0a6a03ca210c734746f42b59ff6cc4b87b4947fdb9d6641a8";
    };
    postInstall = "";  # Don't rename 'buildout' to 'buildout-nix'
    installPhase = pythonPackages.setuptools.installPhase;
    propagatedNativeBuildInputs = with self; [
      pythonPackages.ldap
      pythonPackages.lxml
      pythonPackages.python_magic
      pythonPackages.watchdog
      libmc
      pillow
    ];
  });
};

in stdenv.mkDerivation rec {
  name = "env";
  buildInputs = with self; [ buildout varnish ];
  shellHook = ''
    export SSL_CERT_FILE=${cacert}/etc/ssl/certs/ca-bundle.crt
    export BUILDOUT_ARGS="\
      versions:lxml= \
      versions:Pillow= \
      versions:PyYAML= \
      versions:python-ldap= \
      versions:setuptools= \
      versions:zc.buildout= \
      config:plone-hotfixes= \
      config:chameleon-cache=/tmp \
    "
  '';
}

# ~/.zshrc:
# function nix_prompt { test $IN_NIX_SHELL && echo '[nix-shell] ' }
# ZSH_THEME_GIT_PROMPT_PREFIX="$(nix_prompt)$ZSH_THEME_GIT_PROMPT_PREFIX"
