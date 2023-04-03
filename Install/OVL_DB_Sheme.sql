-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : lun. 03 avr. 2023 à 21:22
-- Version du serveur : 10.6.12-MariaDB-0ubuntu0.22.04.1
-- Version de PHP : 8.1.2-1ubuntu2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `OVL`
--

-- --------------------------------------------------------

--
-- Structure de la table `CredentialsTracker`
--

CREATE TABLE `CredentialsTracker` (
  `id` int(11) NOT NULL,
  `trackerName` varchar(255) NOT NULL,
  `MQTTpswd` varchar(255) NOT NULL,
  `topicRX` varchar(255) NOT NULL,
  `topicTX` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  `safeZoneDiam` tinyint(10) NOT NULL,
  `latSfz` float NOT NULL,
  `lonSfz` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `LogRq`
--

CREATE TABLE `LogRq` (
  `id` int(11) NOT NULL,
  `description` text NOT NULL,
  `timestamp` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `logUser`
--

CREATE TABLE `logUser` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `timestamp` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --------------------------------------------------------

--
-- Structure de la table `Pos_IOT`
--

CREATE TABLE `Pos_IOT` (
  `id` int(11) NOT NULL,
  `lat` float NOT NULL,
  `lon` float NOT NULL,
  `id_iot` int(11) NOT NULL,
  `timestamp` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --------------------------------------------------------

--
-- Structure de la table `Status_IOT`
--

CREATE TABLE `Status_IOT` (
  `id` int(11) NOT NULL,
  `status_charge` int(1) NOT NULL DEFAULT 0,
  `status_bat` int(10) NOT NULL DEFAULT 0,
  `status_alarm` tinyint(1) NOT NULL DEFAULT 0,
  `status_online` tinyint(1) NOT NULL DEFAULT 0,
  `status_ecomode` tinyint(1) NOT NULL DEFAULT 0,
  `status_protection` tinyint(1) NOT NULL DEFAULT 0,
  `status_vh_charge` tinyint(1) NOT NULL DEFAULT 0,
  `status_gps` tinyint(1) NOT NULL DEFAULT 0,
  `id_iot` int(11) NOT NULL,
  `timestamp` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `NotificationToken` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- Index pour les tables déchargées
--

--
-- Index pour la table `CredentialsTracker`
--
ALTER TABLE `CredentialsTracker`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `LogRq`
--
ALTER TABLE `LogRq`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `logUser`
--
ALTER TABLE `logUser`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Pos_IOT`
--
ALTER TABLE `Pos_IOT`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Status_IOT`
--
ALTER TABLE `Status_IOT`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `CredentialsTracker`
--
ALTER TABLE `CredentialsTracker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `LogRq`
--
ALTER TABLE `LogRq`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3247;

--
-- AUTO_INCREMENT pour la table `logUser`
--
ALTER TABLE `logUser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=400;

--
-- AUTO_INCREMENT pour la table `Pos_IOT`
--
ALTER TABLE `Pos_IOT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=880;

--
-- AUTO_INCREMENT pour la table `Status_IOT`
--
ALTER TABLE `Status_IOT`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
