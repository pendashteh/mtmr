#!/usr/bin/env bash

# Usage:
# alias mtmr='__confirm__= default_input__=~/Downloads/mtmr.html /path/to/mtmr.sh move'

default_input__=${default_input__:-''}
datadir__=${datadir__:-$HOME/.mtmr/}

function __puton__ {
  mkdir -p $datadir__
  cd $datadir__
  __installed || __install
}

function __installed {
  [ -d ".git" ]
}

function __install {
  git init
  git commit --allow-empty -m'empty'
}

move__help='@arg files @does move $files to datadir__ @prints null'
move__ () {
  files__="${@:-$default_input__}"
  [ -z "$files__" ] && return -1
  __exec mv $files__ $datadir__ || return
  git add -A
  git commit -m'Updates the changes'
}

job__help='@arg src: path to dir for mtmr* files @does move mtmr* files to $datadir__'
job__ () {
  local src=$1
  test -d "$src" || return -1
  echo checking for $src/mtmr*
  while true; do
    find $src -name "mtmr*" -exec $__app__ --confirm-- off move {} \;
    sleep 60
  done
}

. undies

