echo "Starting OVL Backend installation..."
sudo apt update
clear
sudo apt full-upgrade -y
clear
echo "Installing depedencies 1/2..."
sudo apt install -y nodejs npm mariadb-server
clear
cd ..
cd ./API/API/
echo "Installing depedencies 2/2..."
sudo npm i express mysql bcrypt cors mqtt nodemon
clear
echo "Installing services [OVL_Backend.service]..."
sudo cp ../../Install/OVL_Backend.service /etc/systemd/system/ovl_backend.service
clear
echo "Starting OVL_Backend service..."
sudo systemctl enable --now ovl_backend.service
clear
echo Installation of OVL Backend done !
