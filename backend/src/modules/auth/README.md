# 🔐 Module Auth — Documentation & Architecture

## 1. Responsabilité
Gère l'authentification sécurisée des utilisateurs de la plateforme (Agents de terrain, Acheteurs, Administrateurs) via numéro de téléphone guinéen normalisé et mot de passe chiffré.

## 2. Entités & Relations
- **`User`** : Rôles (`ADMIN`, `AGENT`, `BUYER`), hash du mot de passe (`passwordHash` via Argon2).
- **`Session`** : Suivi des sessions actives, empreinte IP, User-Agent, et hash du refresh token pour rotation cryptographique.

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authentification par téléphone et mot de passe, retourne access token (JWT) et refresh token. |
| `POST` | `/api/v1/auth/refresh` | Public | Renouvellement de l'access token via le refresh token avec rotation en base. |
| `POST` | `/api/v1/auth/logout` | Authentifié | Révocation de la session active de l'utilisateur. |

## 4. Règles de Validation & Sécurité
- Téléphone validé au format guinéen : `+224` suivi de 9 chiffres (ex: `+224621000002`).
- Mots de passe chiffrés avec **Argon2id** (mémoire et coût CPU configurés pour résister au brute-force).
- Expiration courte des Access Tokens (15 min à 24h) et longue des Refresh Tokens (7 jours).
- Protection contre les attaques par force brute via `ThrottlerGuard` (limité à 5 tentatives de connexion par minute par IP).

