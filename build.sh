#! /usr/bin/env bash

set -e
set -x

environment=$1

export NODE_ENV=$environment

yarn build
