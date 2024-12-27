# How to start

## Setup

### Set up a MongoDB database

Set up a MongoDB database either locally or with [MongoDB Atlas for free](https://mongodb.com/atlas).

### Set up environment variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

- `MONGODB_URI` - Your MongoDB connection string. If you are using [MongoDB Atlas](https://mongodb.com/atlas) you can find this by clicking the "Connect" button for your cluster.
- `GARMIN_EMAIL` - Your email address at garmin, via which the data should be synchronized. All participants must be friends with this Garmin account
- `GARMIN_PWD` - The password for the garmin account
- `DISABLE_AUTOUPDATE` - Set this to true, if you want to disable the garmin synchronisation temporary. This is usefull, when you want to test this in a local enviroment.
- `VAPID_PUBLIC_KEY` - The public key for the push notifications
- `VAPID_PRIVATE_KEY` - The private key for the push notifications

### Run Next.js in development mode

```bash
npm install
npm run dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000)!

## Deploy on Vercel

To deploy your local project to Vercel, push it to GitHub/GitLab/Bitbucket and [import to Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example).

**Important**: When you import your project on Vercel, make sure to click on **Environment Variables** and set them to match your `.env.local` file.
