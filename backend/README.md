# AREA POC

Ce PoC montre l'utilisation de NestJS pour effectuer une REAction (publication sur
un salon Discord via un webhook) lorsqu'une Action (mettre un "j'aime" sur une
vidéo YouTube) se produit.

# Utilisation

### Cloner le dépôt

Pour cloner le repo, vous devrez avoir git d'installé. Entrez ces commandes
dans un terminal :
```bash
git clone git@github.com:EpitechPromo2027/B-DEV-500-LIL-5-1-area-merlin.cyffers
# git clone https://github.com/EpitechPromo2027/B-DEV-500-LIL-5-1-area-merlin.cyffers # Si vous n'avez pas configurer de clé SSH.
cd B-DEV-500-LIL-5-1-area-merlin.cyffers
git checkout poc # Checkout la branche du PoC
```

### Configuration

Vous devrez configurer les variables d'environnement à l'aide du fichier `.env.example`
qui devra être renommé `.env` une fois prêt à l'emploi.

###### Serveur Web

Pour le serveur Web, vous n'avez qu'à configurer le port d'écoute souhaité.
Ce port ne doit pas être déjà utilisé par un autre processus.

###### Base de données

La base de données n'est pas utilisée pour ce PoC, vous n'avez pas besoin de
la  configurer, bien qu'elle démarre. Si toute fois vous souhaitez tout de même
la configurer, vous avez un apperçu des champs à renseigner dans le fichier `.env.example`.

###### API YouTube et OAuth 2.0
Vous devrez y renseigner vos informations d'identification pour l'API YouTube.

Pour ce faire, rendez-vous dans la [Console Développeur de Google](https://console.cloud.google.com/cloud-resource-manager) puis cliquez sur `CREATE PROJECT`. Renseignez un nom ainsi qu'une organisation, si besoin, puis cliquez
sur `CREATE`. Vous serez alors redirigé sur la page d'accueil. Vous verez aussi
une notification en haut à droite vous indiquant que votre projet est créé.
Cliquez sur `SELECT PROJECT` pour configurer le projet.

Cliquez ensuite sur `GO TO API OVERVIEW` au milieu de la page, puis sur `ENABLE API AND SERVICES`. Cherchez l'API `YouTube Data API v3`, activez-là en cliquant sur `ENABLE`, puis créez des identifiants `OAuth client ID` en cliquant sur `CREATE CREDENTIALS`.

Suivez la méthode suivante :
-   I. sur la page `Credential Type`, sélectionnez `YouTube Data API v3` pour le champs `API` ainsi que `User data` pour le champs `What data will you be accessing`, puis cliquez sur `NEXT`,
-  II. sur la page `OAuth Consent Screen`, renseignez un nom d'application, une adresse email de support et une adresse email de développeur, puis cliquez sur `SAVE AND CONTINUE`,
- III. sur la page `Scopes`, cliquez sur `ADD OR REMOVE SCOPES`, saisissez `https://www.googleapis.com/auth/youtube.readonly` dans l'espace `Manually add scopes`, cliquez sur `ADD TO TABLE` puis sur `UPDATE` et cliquez sur `SAVE AND CONTINUE`,
-  IV. sur la page `OAuth client ID`, sélectionnez `Web application` pour le champs `Application type`, renseignez ensuite un nom d'application, puis sur `+ ADD URI` dans la catégorie `Authorized redirect URIs`. Renseignez-y l'URL suivante : `http://localhost:<REST_API_PORT>/youtube/callback`. Notez que `REST_API_PORT` est l'une des variables d'environnement que vous avez configuré au début. Cliquez ensuite sur `CREATE`,
-   V. sur la page `Your Credentials` vous pouvez télécharger un fichier qui devrait être au format `JSON` et comporter le `client_id` et le `client_secret` de votre projet. Renseignez ces valeurs respectivement pour les clés `YOUTUBE_CLIENT_ID` et `YOUTUBE_CLIENT_SECRET`, puis cliquez sur `DONE`,
-  VI. rendez-vous dans l'onglet `OAuth Consent Screen` de votre projet puis, dans la catégorie `Test users`, cliquez sur `+ ADD USERS`. Renseignez ensuite l'adresse email liée au compte YouTube dont vous souhaitez avoir les notifications, puis cliquez sur `SAVE`. Vous devrez utiliser ce compte pour vous connecter en temps voulu sur l'application Web du PoC AREA.

###### API Discord et Webhook

Pour envoyer une notification lorsqu'une nouvelle vidéo est aimée par l'utilisateur
YouTube, vous devez créer un webhook Discord.

Pour cela, rendez-vous dans un salon textuel Discord dans lequel vous voulez
être notifié. Passez votre curseur sur le nom du salon et cliquez sur
l'engrenage pour accéder aux paramètres du salon. Rendez-vous dans la section
`Integrations` puis cliquez sur la catégorie `Webhooks`. Cliquez ensuite sur
`New Webhook`.

Lorsque votre webhook est créé, modifiez-le à souhait, puis cliquez sur `Copy Webhook URL`.
Vous devrez en extraire l'identifiant et le secret. Voici le format :
`https://discord.com/api/webhooks/DISCORD_WEBHOOK_ID/DISCORD_WEBHOOK_SECRET`.
Renseignez ces valeurs dans le fichier `.env`.

### Proof of Concept

Vous allez devoir utiliser Docker pour démarrer le projet. Pour ce faire, entrez
la commande suivante dans un terminal :

```bash
 # Build le projet et démarre les services requis.
docker compose up
```

Une fois les services démarrés, vous pourrez accéder à l'application depuis un
navigateur web en renseignant l'adresse suivante dans l'URL :

```
http://localhost:<REST_API_PORT>/youtube
```

Vous serez automatiquement redirigé sur une page de connexion et d'autorisation
de Google pour accéder à vos informations YouTube. Vous devrez vous connecter
avec le compte d'utilisateur test que vous avez renseigner lors de la création
des identifiants d'identification OAuth2.0 .

Une fois fait, vous serez redirigé sur l'application. Vous n'avez plus qu'à
attendre. Allez sur une vidéo, utilisez l'interaction "j'aime", et dans les 10
secondes qui suivent votre Action, une REAction devrait apparaître dans le salon
Discord que vous avez configuré pour accueillir les notifications.
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
