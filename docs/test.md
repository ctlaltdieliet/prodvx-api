# ProDVX API - LED Control
This API enables external control of ProDVX panels with built-in LED lights.\
To see installation instructions, open a browser on the ProDVX panel and go to: tiny.cc/prodvxapi

## Installation Steps
1. Download [Termux](https://f-droid.org/repo/com.termux_75.apk) and [Termux:Boot](https://f-droid.org/repo/com.termux.boot_6.apk)
2. Install both apps.
3. Run Termux:Boot, then close.
4. Run Termux. Leave Termux open.
5. Copy the command for your device below, then run it inside Termux:

SLB
```bash
bash <(curl https://raw.githubusercontent.com/AudioVisualDistributors/OvertureDrivers/master/scripts/prodvx_api/install_slb.sh)


<p>
<b>DSKPL</b>
<textarea id="dskpl-cmd" onclick="this.focus();this.select()"></textarea>
<button onclick="copyText(document.getElementById('dskpl-cmd').value)">COPY DSKPL INSTALL COMMAND</button>
</p>