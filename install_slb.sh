pkg install nodejs tsu -y &&
npm i -g forever &&
mkdir -p $HOME/.termux/boot &&
echo "tsudo node $PREFIX/bin/forever $HOME/server_slb.js" > $HOME/.termux/boot/startserver &&
curl -O "https://raw.githubusercontent.com/avdistributors/prodvx-api/master/server_slb.js" &&
/system/bin/reboot