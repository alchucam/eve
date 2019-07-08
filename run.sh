#!/bin/sh

set -o nounset \
    -o errexit

if [ $# -ne 0 ]; then
  echo "Loading environment variables..."
  for var in "$@"
  do
    export "$var"
  done
fi