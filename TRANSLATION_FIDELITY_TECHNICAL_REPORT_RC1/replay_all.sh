#!/bin/sh
set -eu

RC_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PYTHON_BIN=${PYTHON_BIN:-python3}

exec "$PYTHON_BIN" "$RC_DIR/compat/portable_replay.py"

