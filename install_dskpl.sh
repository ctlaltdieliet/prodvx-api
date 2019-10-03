pkg install nodejs &&
pkg install tsu &&
pkg install curl &&
npm i -g forever &&
mkdir -p $HOME/.termux/boot &&
echo "tsudo node $PREFIX/bin/forever $HOME/server_dskpl.js" > $HOME/.termux/boot/startserver &&
curl -O "https://raw.githubusercontent.com/avdistributors/prodvx-api/master/server_dskpl.js" &&
/system/bin/reboot