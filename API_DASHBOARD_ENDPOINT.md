# API Backend - Dashboard Endpoint Specification

## Context
L'application DriveOps charge actuellement les données du dashboard via **5 appels API séquentiels**, ce qui crée des délais de chargement importants (plusieurs secondes). Nous devons créer un endpoint unifié qui retourne toutes les données en un seul appel.

---

## Nouveau Endpoint Requis

### Route
```
GET /api/users/{userId}/dashboard
```

### Headers
```
Authorization: Bearer {token}
```

### Paramètres
- `userId` (path parameter, string) : ID de l'utilisateur authentifié

---

## Format de Réponse Attendu

```json
{
  "vehicles": {
    "count": 3,
    "list": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "name": "Ma Voiture",
        "brand": "Peugeot",
        "model": "308",
        "year": 2020,
        "license_plate": "AB-123-CD",
        "mileage": 45000,
        "purchase_date": "2020-03-15",
        "created_at": "2024-01-01T10:00:00Z",
        "updated_at": "2024-06-15T14:30:00Z"
      }
      // ... autres véhicules
    ]
  },
  "maintenances": {
    "upcoming": 2,
    "late": 1
  },
  "invoices": {
    "count": 15
  }
}
```

---

## Détails des Données

### 1. `vehicles`
- **`count`** : Nombre total de véhicules de l'utilisateur
- **`list`** : Liste complète des véhicules (toutes les propriétés)

### 2. `maintenances`
- **`upcoming`** : Nombre d'entretiens programmés à venir (futurs)
- **`late`** : Nombre d'entretiens en retard

### 3. `invoices`
- **`count`** : Nombre total de factures de l'utilisateur

---

## Logique Backend à Implémenter

Remplacer ces 5 endpoints actuels :
```
GET /api/users/{userId}/vehicles/count
GET /api/users/{userId}/vehicles
GET /api/users/{userId}/maintenances/future
GET /api/users/{userId}/maintenances/late
GET /api/users/{userId}/invoices
```

Par un seul endpoint optimisé qui :
1. Récupère les véhicules (avec count)
2. Compte les maintenances futures
3. Compte les maintenances en retard
4. Compte les factures
5. Retourne tout en une seule réponse JSON

---

## Optimisations Suggérées

### Option 1 : Requêtes parallèles
Exécuter toutes les requêtes SQL en parallèle et agréger les résultats

### Option 2 : Requête unique optimisée
Si possible, utiliser des JOINs et agrégations SQL pour tout récupérer en une seule requête

### Option 3 : Cache
Envisager un cache court (30-60 secondes) pour les données du dashboard si l'utilisateur rafraîchit souvent la page

---

## Sécurité

- ✅ Vérifier que l'utilisateur authentifié a bien le droit d'accéder aux données du `userId` fourni
- ✅ Appliquer les mêmes règles d'autorisation que les endpoints individuels
- ✅ Valider le format du `userId`

---

## Codes de Statut HTTP

- **200 OK** : Données retournées avec succès
- **401 Unauthorized** : Token manquant ou invalide
- **403 Forbidden** : L'utilisateur n'a pas accès aux données de cet userId
- **404 Not Found** : Utilisateur non trouvé
- **500 Internal Server Error** : Erreur serveur

---

## Tests Suggérés

1. Utilisateur avec 0 véhicules
2. Utilisateur avec plusieurs véhicules
3. Performance : mesurer le temps de réponse (<200ms idéal)
4. Utilisateur tentant d'accéder aux données d'un autre utilisateur (403)

---

## Frontend Changes (Already Implemented)

Le frontend a été mis à jour pour :
- Appeler `GET /api/users/{userId}/dashboard`
- Afficher un état de chargement pendant la requête
- Gérer les erreurs gracieusement
- Typer la réponse avec l'interface TypeScript `DashboardData`

---

## Questions ?

Si vous avez besoin de clarifications sur la structure des données ou les besoins métier, n'hésitez pas à demander !
