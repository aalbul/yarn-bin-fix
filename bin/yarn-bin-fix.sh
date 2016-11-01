#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
  *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

command_exists() {
  command -v "$1" >/dev/null 2>&1;
}

echo "${basedir}"

if command_exists node; then
  echo "here"
  node "${basedir}/yarn-bin-fix.js"
  ret=$?
# Debian and Ubuntu use "nodejs" as the name of the binary, not "node", so we
# search for that too. See:
# https://lists.debian.org/debian-devel-announce/2012/07/msg00002.html
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=614907
elif command_exists nodejs; then
  nodejs "${basedir}/yarn-bin-fix.js"
  ret=$?
else
  echo 'Yarn requires Node.js 4.0 or higher to be installed.'
  ret=1
fi

exit $ret
