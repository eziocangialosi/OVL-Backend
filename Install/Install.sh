echo "Starting OVL Backend installation..."
sudo apt update
clear
sudo apt full-upgrade -y
clear
echo "Installing depedencies 1/2..."
sudo apt install -y nodejs npm mariadb-server
mysql -e "UPDATE mysql.user SET Password=PASSWORD('ABigAndKomplexP@ssWord') WHERE User='root'; quit;"
mysql -e "CREATE DATABASE OVL; quit;"
mysql OVL < OVL_DB_Sheme.sql
clear
cd ..
cd ./API/API/
echo "Installing depedencies 2/2..."
sudo npm i express base64url mysql bcrypt cors mqtt nodemon discord-webhook-node expo-server-sdk express-rate-limit jsonwebtoken
clear
echo "Installing services [OVL_Backend.service]..."
sudo cp ../../Install/OVL_Backend.service /etc/systemd/system/ovl_backend.service
clear
echo "Starting OVL_Backend service..."
sudo systemctl enable --now ovl_backend.service
clear
echo Installation of OVL Backend done !
