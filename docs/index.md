# ProDVX API - LED Control
This API enables external control of ProDVX panels with built-in LED lights.
To see these installation instructions, open a browser on your ProDVX panel and go to [tiny.cc/prodvxapi](tiny.cc/prodvxapi).

## Installation Steps
1. Download Termux and Termux:Boot using the buttons at the top of this page.
2. Install both apps by either clicking on the download in the notification bar, or using the "ApkInstaller" app.
3. Run Termux:Boot, then close.
4. Run Termux. Leave Termux open.
5. Copy the command for your device below, then run it inside Termux:

SLB
```bash
bash <(curl https://raw.githubusercontent.com/AudioVisualDistributors/OvertureDrivers/master/scripts/prodvx_api/install_slb.sh)
```

DSKPL
```bash
bash <(curl https://raw.githubusercontent.com/AudioVisualDistributors/OvertureDrivers/master/scripts/prodvx_api/install_dskpl.sh)
```