pkg install nodejs wget tsu -y &&
npm i -g forever &&
mkdir -p $HOME/.termux/boot &&
echo "tsudo node $PREFIX/bin/forever $HOME/server_dskpl.js" > $HOME/.termux/boot/startserver &&
wget -O "https://raw.githubusercontent.com/ctlaltdieliet/prodvx-api/master/server_dskpl.js" &&
/system/bin/reboot