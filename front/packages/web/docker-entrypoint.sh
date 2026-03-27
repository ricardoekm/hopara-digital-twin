#!/usr/bin/env sh
set -e

if [ -n "${AUTH_ENABLED:-}" ]; then
  echo ">> Generating config.js..."
  cat > config.js <<EOF
window.__env__ = {
  AUTH_ENABLED: "${AUTH_ENABLED}"
};
EOF
else
  echo ">> Skipping config.js."
fi

exec "$@"