#!/usr/bin/env bash

datadir__=$HOME/.mtmr/

function main {
  __init || return
  __installed || __install || return
  __process_args "$@" || return
  __move
}

function __process_args {
  [ -z "$1" ] && return 1
  files__="$@"
  return 0
}

function __init {
  mkdir -p $datadir__
  cd $datadir__
}

function __installed {
  [ -d ".git" ]
}

function __install {
  git init
  git commit --allow-empty -m'empty'
}

function __confirm {
  echo $@
  read -p 'Are you sure? y|N '
  case $REPLY in [^yY]) echo "cancled."; return 1;; esac
  "$@"
  return 0
}

function __move {
  __confirm mv "$files__" $datadir__ || return
  git add -A
  git commit -m'Updates the changes'
}

main "$@"
