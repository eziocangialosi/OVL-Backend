#!/bin/bash

# Ask install path
printf 'Please enter the full path on which you want to install the server: '
read install_path

# Check if user provided a real path
if [ ! -d "$install_path" ]; then
    echo "Invalid path. Please create the directory or provide a valid path."
    exit 1
fi

# Copy service file
sudo cp ./Install/OVL_Backend.service /etc/systemd/system/ovl_backend.service

# Update path
sed -i "s|^ExecStart=.*|ExecStart=/usr/bin/node $install_path/index.js|" /etc/systemd/system/ovl_backend.service

# Update system
echo "[1/7] Starting OVL Backend installation..."
sudo apt update && sudo apt full-upgrade -y

# Installing dependencies 1/2
echo "[2/7] Installing dependencies 1/2..."
sudo apt install -y nodejs npm mariadb-server certbot mosquitto


echo "[3/7] Setting up MariaDB user..."
sudo mysql -e "CREATE DATABASE OVL;"

# Install BDD
echo "[4/7] Installing database..."
if [ -f ./Install/OVL_DB_Sheme.sql ]; then
    mysql OVL < ./Install/OVL_DB_Sheme.sql
else
    echo "Database schema file not found!"
    exit 1
fi

# Setup MariaDB user
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'ABigAndKomplexP@ssWord';"

# Copy api files
echo "[5/7] Copying API files..."
cp -r ./API/API/* "$install_path"
cd $install_path

# Mosquitto Setup
echo "Setting up Mosquitto password..."
sudo /usr/bin/mosquitto_passwd -b mqtt-password MQTT_REST_API ABigAndKomplexP@ssWord
if [ -f /etc/mosquitto/mosquitto_passwd ]; then
    sudo rm /etc/mosquitto/mosquitto_passwd
fi
sudo cp mqtt-password /etc/mosquitto/mqtt-password
sudo systemctl reload mosquitto.service

# Installing dependencies 2/2
echo "[6/7] Installing dependencies 2/2..."
sudo npm i express base64url mysql bcrypt cors mqtt nodemon discord-webhook-node expo-server-sdk express-rate-limit jsonwebtoken

# # SSL Setup
# echo "Starting SSL certification server, please make sure your machine's port 80 is open on your router."
# sudo node setup_ssl.js &
# sleep 3
# echo "Launching Certbot tool. Follow the instructions to complete the SSL setup."
# sudo certbot certonly --manual

# echo "Please note down SSL certificate path, press any key to continue."
# read -n 1 -s
# sudo pkill -f "node setup_ssl.js"

# Open config to the user
sudo editor config.js
sleep 3

# Active and start the new service
echo "[7/7] Starting service [OVL_Backend.service]..."
sudo systemctl enable --now ovl_backend.service

# End
echo "Installation of OVL Backend done!"
