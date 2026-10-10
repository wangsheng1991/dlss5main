# IndexNow submission

The main site exposes the public verification key at
`https://www.dlss5nvidia.com/5b94cb6429e608840860ddc1e1682f1d.txt`.

After a production build and deploy, submit the URLs already present in the built sitemap:

```sh
npm run build
npm run indexnow:submit -- --dry-run
npm run indexnow:submit
```

The command sends one batch (the current sitemap is below IndexNow's 10,000 URL limit) to
`api.indexnow.org`. IndexNow can notify Bing, Naver, Seznam, Yandex and Yep; Google does not use
this endpoint, so Google indexing still relies on Search Console and the sitemap. The command is
explicit rather than part of `npm run build` so local builds never notify external engines.
