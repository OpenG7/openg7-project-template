# Recette optionnelle : cycle de vie d’un gateway local

Cette recette guide un projet qui sert son Web en développement tout en gardant
son API dans une pile locale existante. Elle décrit une adaptation à réaliser et
à vérifier dans ce projet; le template ne livre aucun lanceur exécutable.

L’adoption est explicite, hors du [manifest de synchronisation](../../scripts/sync-manifest.json).
Elle n’ajoute aucune obligation au socle commun. La stack, le gestionnaire de
paquets et les opérations de production restent propres à chaque dépôt.

## Commandes du projet consommateur

| Commande | Comportement attendu |
| --- | --- |
| `dev:gateway` | Démarrer le serveur Web local et activer son routage après vérification de disponibilité. |
| `dev:gateway:stop` | Demander au lanceur actif d’arrêter ses processus et de rétablir le routage précédent. |
| `dev:gateway:restore` | Récupérer le routage après un arrêt brutal, une fois la session arrêtée. |

Extrait de `package.json` pour un projet Node ayant implémenté son propre
`scripts/dev-gateway.mjs` avec les options ci-dessous. Ce fichier n’existe pas
dans le template; copier ces alias seuls ne fournit pas leur comportement.

```json
{
  "scripts": {
    "dev:gateway": "node scripts/dev-gateway.mjs",
    "dev:gateway:stop": "node scripts/dev-gateway.mjs --stop",
    "dev:gateway:restore": "node scripts/dev-gateway.mjs --restore"
  }
}
```

Le projet peut ajouter les alias personnels `1`, `2`, `3` vers ces commandes,
si ces noms sont libres. Les instructions expliquent leur invocation avec le
gestionnaire réellement utilisé, par exemple `yarn dev:gateway` ou
`npm run dev:gateway`. Aucun gestionnaire n’est requis par cette recette.

## Configuration à fournir localement

Le dépôt consommateur définit la commande Web et ses arguments, les ports et
adresses d’écoute, les sondes de disponibilité et leurs délais, le reverse proxy,
les chemins de routage et les certificats de développement. Les identités et
origines autorisées existantes doivent rester compatibles avec le routage local.

Les fichiers de session, demandes d’arrêt et sauvegardes de routage utilisent des
chemins dédiés au projet, ignorés par Git et sans secrets ni données métier.
Leur propriétaire définit les droits d’accès et la reprise. Un numéro de port
occupé ne suffit jamais à identifier un processus que le lanceur peut arrêter.

## Démarrage, arrêt et récupération

1. **Démarrer.** Vérifier la cible locale, les préconditions et l’absence d’une
   session active. Une création exclusive du fichier de session empêche deux
   lanceurs de prendre simultanément possession du même routage. Enregistrer un
   UUID de session, le PID et la sauvegarde avant toute modification. Démarrer
   uniquement les processus possédés par le lanceur; appliquer le routage de
   développement après les sondes Web et proxy réussies.
2. **Arrêter.** `Ctrl+C` dans le terminal d’origine et la commande d’arrêt depuis
   un autre terminal rejoignent le même nettoyage du lanceur. Une demande
   coopérative porte l’UUID de session; une demande ancienne ou destinée à une
   autre session est ignorée. Le PID sert à vérifier la présence d’un processus,
   sans autoriser à lui seul sa terminaison. Ne pas tuer tous les occupants d’un
   port ou tous les processus d’un runtime.
3. **Nettoyer.** Arrêter les enfants créés, rétablir le routage sauvegardé et
   vérifier son chargement avant d’annoncer le succès. Borner l’attente. L’échec
   d’un nettoyage secondaire, comme retirer une demande d’arrêt, ne doit pas
   empêcher la tentative de restauration principale. Après arrêt et restauration
   réussis, une commande répétée réussit sans effet supplémentaire.
4. **Récupérer.** Refuser la restauration pendant une session active. Si le
   routage courant a changé indépendamment, préserver ce fichier et la sauvegarde
   pour revue. En cas d’échec ou de délai dépassé, garder les preuves nécessaires
   et signaler la commande de récupération; ne pas annoncer un succès incertain.
   Retirer la sauvegarde seulement après restauration vérifiée.

Les lectures partielles d’une demande en cours d’écriture ne déclenchent aucun
arrêt. Si une nouvelle session remplace l’ancienne pendant l’attente, l’ancienne
commande échoue explicitement et préserve les fichiers de la nouvelle session.

Ce cycle ne redémarre pas l’API, la base ou le fournisseur d’identité et ne
déclenche ni migration, ni paiement, ni publication, ni opération de production.
Toute opération supplémentaire appartient au runbook du projet et à son autorisation.

## Validation avant adoption

Le consommateur ajoute les tests et contrôles adaptés à son implémentation :

- arrêt depuis un autre terminal et par `Ctrl+C`, processus enfants terminés,
  port libéré et ancien routage accessible;
- arrêt et récupération répétés après nettoyage complet, sans effet supplémentaire;
- demande malformée, ancienne ou d’une autre session ignorée; nouvelle session
  préservée pendant l’arrêt de l’ancienne;
- port occupé par un service inconnu : refus du démarrage et aucun arrêt de ce service;
- échec de démarrage, de sonde, d’arrêt ou de restauration : résultat explicite,
  sauvegarde conservée lorsque la récupération reste nécessaire;
- modification indépendante du routage : aucun écrasement silencieux;
- fonctionnement sur les systèmes annoncés, notamment Windows et Linux si les
  deux sont pris en charge; tests isolés sans cible métier ni production.

Une simulation de processus ou de proxy ne prouve pas une intégration réelle.
Consigner séparément les tests isolés et le cycle local vérifié avec la stack du
projet. L’exemple [Funding](https://github.com/OpenG7/openg7-funding-platform)
illustre un contexte Angular, reverse proxy et API conteneurisée; ses chemins,
ports et réglages d’identité restent locaux, à examiner à la révision adoptée.

Cette recette ne constitue pas un outil commun publié. Une extraction éventuelle
demande un second usage concret, une configuration sans noms produit et un
propriétaire de maintenance; elle ne s’ajoute pas implicitement au synchroniseur.
