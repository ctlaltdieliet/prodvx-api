This API enables external control of ProDVX panels with built-in LED lights.<br>
To see these installation instructions, open a browser on your ProDVX panel and go to [tiny.cc/prodvxapi](tiny.cc/prodvxapi).

## Installation Steps
1. Download APKs for Termux and Termux:Boot using the buttons at the top of this page.
2. Install both apps by either clicking on the download in the notification bar, or using the "ApkInstaller" app.
3. Run Termux:Boot, then close.
4. Run Termux. Leave Termux open.
5. Click the code snippet below to copy the command for your device, then paste and run it inside Termux.

#### SLB
```
pkg install curl -y && bash <(curl https://raw.githubusercontent.com/avdistributors/prodvx-api/master/install_slb.sh)
```


#### DSKPL
```
pkg install curl -y && bash <(curl https://raw.githubusercontent.com/avdistributors/prodvx-api/master/install_dskpl.sh)
```