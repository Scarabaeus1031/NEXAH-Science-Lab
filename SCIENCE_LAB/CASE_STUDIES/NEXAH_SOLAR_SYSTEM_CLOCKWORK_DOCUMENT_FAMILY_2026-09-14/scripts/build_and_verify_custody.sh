#!/bin/zsh
set -euo pipefail

package_dir="${0:A:h:h}"
source_dir='/Users/tho2020/Desktop/00_INCOMING/SolarSystem Clockwork'
snapshot_dir="$package_dir/SOURCE_SNAPSHOT"
inventory="$package_dir/SOURCE_INVENTORY.csv"
manifest="$package_dir/SHA256_MANIFEST.txt"

print -r -- 'relative_path,byte_size,extension,mime_type,sha256,source_match' > "$inventory"
while IFS= read -r -d '' file; do
  relative_to_snapshot="${file#$snapshot_dir/}"
  size=$(stat -f '%z' "$file")
  name="${file:t}"
  extension="${name:e:l}"
  mime=$(file --mime-type -b "$file")
  digest=$(shasum -a 256 "$file" | awk '{print $1}')
  source_digest=$(shasum -a 256 "$source_dir/$relative_to_snapshot" | awk '{print $1}')
  match=NO
  [[ "$digest" == "$source_digest" ]] && match=YES
  escaped_path=${relative_to_snapshot//\"/\"\"}
  print -r -- "\"SOURCE_SNAPSHOT/$escaped_path\",$size,$extension,$mime,$digest,$match" >> "$inventory"
done < <(find "$snapshot_dir" -type f -print0 | sort -z)

tmp_manifest="$manifest.tmp"
: > "$tmp_manifest"
while IFS= read -r file; do
  relative="${file#$package_dir/}"
  digest=$(shasum -a 256 "$file" | awk '{print $1}')
  print -r -- "$digest  $relative" >> "$tmp_manifest"
done < <(find "$package_dir" -type f ! -name 'SHA256_MANIFEST.txt' ! -name 'SHA256_MANIFEST.txt.tmp' | sort)
mv "$tmp_manifest" "$manifest"

cd "$package_dir"
shasum -a 256 -c SHA256_MANIFEST.txt
[[ $(find SOURCE_SNAPSHOT -type f | wc -l | tr -d ' ') == 34 ]]
[[ $(awk -F, 'NR > 1 && $NF == "YES" {n++} END {print n+0}' SOURCE_INVENTORY.csv) == 34 ]]
[[ $(find SOURCE_SNAPSHOT -type f -print0 | xargs -0 stat -f '%z' | awk '{s+=$1} END {print s+0}') == 63269588 ]]
print -r -- 'SOLAR_SYSTEM_CLOCKWORK_CUSTODY_VERIFIED=YES'
