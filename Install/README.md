<a href="https://github.com/eziocangialosi/OpenVehicleLocator">
    <img src="https://raw.githubusercontent.com/eziocangialosi/OVL-Documentation/master/images/OVL_logo_name_white.png" alt="OVL logo" title="OVL" align="right" height="60" />
</a>

# Installation instructions of Backend Services

## First of all you need to check the list of the requirement bellow

1. 🖥️ | Have a linux environnement with APT package manager, Ubuntu Server is a good choice for beginners 😉.
2. 🦸 | Have SuperUser (root / sudo) rights on the machine.
3. 📖 | Know how to run commands in a shell (cd chmod etc...).
4. 📶 | Have a valid domain name and an open port on your rooter to bind to the API.

## How to install ?

Here is the install process

1. Clone the repo to your linux root (/) : `sudo git clone https://github.com/eziocangialosi/OVL-Backend.git /API`
2. Run the following command with root privileges : `cd /API/Install && sudo chmod +x ./Install.sh && sudo ./Install.sh`
3. When prompted follow the [Certbot setup process](#Certbot-setup-process) ⚠️ **without this step API will not work** ⚠️
4. Edit the config file carefully, you can refer to the [documentation](https://github.com/eziocangialosi/OVL-Backend/blob/master/API/API/config.js)
5. Follow the install progress, after run the following command `systemctl status ovl_backend.service` , if all goes right you will see something like [this](https://github.com/eziocangialosi/OVL-Backend/blob/master/Install/image/README/1680551717284.png "Screenshot of OVL Backend systemd service.")![1680551717284](image/README/1680551717284.png)

## Certbot setup process

> :warning: **You will need to use another shell to do this step, for example a ssh session.**
> :warning: **Make sure your router have the 80 port open and bridged to your server.**
1. When the tool show you the filename and the file content adapt and run the following command `sudo nano /API/API/API.well-known/acme-challenge/FILENAME`, and put the string from certbot in the file.
2. After this you can use a web browser to test your setup before continuing the SSL installation go to http://yourdomain.com/.well-known/acme-challenge/FILENAME
3. If your browser allow you to download the file you can continue the setup process 😉.

## How to configure ?

To configure all the backend REST API you just need to edit the [config.js](https://github.com/eziocangialosi/OVL-Backend/blob/master/API/API/config.js "REST API Config file."), the default config file will not necessarily suit to your needs so check it 😉.

Need help to setup the config file ? You can check the documentation [here](https://ovl.tech-user.fr:7070/docs/backend/Config.html "Link to the config documentation.").

Keep in mind that the `Server_Port` need to be accessible outside of your network, consult your router documentation to know how to forward TCP/UDP Ports.

After editing the [config.js](https://github.com/eziocangialosi/OVL-Backend/blob/master/API/API/config.js "REST API Config file.") file you need to restart the Backend SYSTEMD service, to do this you need to run the following command with root privileges :  `systemctl restart ovl_backend.service && systemctl status ovl_backend.service`.
