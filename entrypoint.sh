#!/bin/sh
npx prisma db push
node dist/src/main.js