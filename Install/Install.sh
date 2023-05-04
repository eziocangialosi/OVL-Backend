echo "[1/7]  Starting OVL Backend installation..."
sudo apt update
clear
sudo apt full-upgrade -y
clear
echo "[2/7]  Installing depedencies 1/2..."
sudo apt install -y nodejs npm mariadb-server certbot
clear
echo "[3/7]  Setting up mariadb user..."
mysql -e "UPDATE mysql.user SET Password=PASSWORD('ABigAndKomplexP@ssWord') WHERE User='root'; quit;"
clear
echo "[4/7]  Installing database..."
mysql -e "CREATE DATABASE OVL; quit;"
mysql OVL < OVL_DB_Sheme.sql
clear
cd ..
cd ./API/API/
echo "[5/7]  Installing depedencies 2/2..."
sudo npm i express base64url mysql bcrypt cors mqtt nodemon discord-webhook-node expo-server-sdk express-rate-limit jsonwebtoken
clear
echo "Starting SSL certification server, please make sure your machine 80 port is open on your router."
sudo node setup_ssl.js &
sleep 3
echo "Launching certbot tool, please follow the install instructions here "
sudo certbot certonly --manual
echo "Please note down SSL certificate path, press any key to continue."
read -n 1 -s
sudo pkill -f "node setup_ssl.js"
sudo nano config.js
sleep 3
echo "[6/7]  Installing service [OVL_Backend.service]..."
sudo cp ../../Install/OVL_Backend.service /etc/systemd/system/ovl_backend.service
clear
echo "[1/7]  Starting service [OVL_Backend.service]..."
sudo systemctl enable --now ovl_backend.service
clear
echo Installation of OVL Backend done !
