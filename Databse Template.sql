-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : mer. 01 mars 2023 à 23:10
-- Version du serveur : 10.6.12-MariaDB-0ubuntu0.22.04.1
-- Version de PHP : 8.1.2-1ubuntu2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `Test`
--

-- --------------------------------------------------------

--
-- Structure de la table `CredentialsTracker`
--

CREATE TABLE IF NOT EXISTS `CredentialsTracker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trackerName` varchar(255) NOT NULL,
  `MQTTpswd` varchar(255) NOT NULL,
  `topicRX` varchar(255) NOT NULL,
  `topicTX` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `LogRq`
--

CREATE TABLE IF NOT EXISTS `LogRq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `LastRq` varchar(255) NOT NULL,
  `id_iot` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `tm_LastRq` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `logUser`
--

CREATE TABLE IF NOT EXISTS `logUser` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `tm_user` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Pos_IOT`
--

CREATE TABLE IF NOT EXISTS `Pos_IOT` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lat` float NOT NULL,
  `lon` float NOT NULL,
  `id_iot` int(11) NOT NULL,
  `timestamp` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Status_IOT`
--

CREATE TABLE IF NOT EXISTS `Status_IOT` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status_charge` int(1) NOT NULL DEFAULT 0,
  `status_bat` int(10) NOT NULL DEFAULT 0,
  `status_alarm` tinyint(1) NOT NULL DEFAULT 0,
  `status_online` tinyint(1) NOT NULL DEFAULT 0,
  `status_ecomode` tinyint(1) NOT NULL DEFAULT 0,
  `status_protection` tinyint(1) NOT NULL DEFAULT 0,
  `status_vh_charge` tinyint(1) NOT NULL DEFAULT 0,
  `status_gps` tinyint(1) NOT NULL DEFAULT 0,
  `id_iot` int(11) NOT NULL,
  `timestamp` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
