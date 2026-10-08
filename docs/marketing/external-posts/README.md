# Automated external publishing

`scripts/publish-external.mjs` supports two destinations:

- **Bluesky**: creates an `app.bsky.feed.post` through the account's PDS.
- **DEV/Forem**: creates an article through `POST https://dev.to/api/articles`.

The default is always a dry run. The script only performs a third-party write when both conditions are true:

1. the command includes `--publish`;
2. `ALLOW_EXTERNAL_PUBLISH=1` is present in the environment.

Keep credentials in the shell or a local secret manager; do not put them in this directory or commit them.

## Preview

```bash
node scripts/publish-external.mjs \
  --platform bluesky \
  --content docs/marketing/external-posts/bluesky-comparisons-en.txt

node scripts/publish-external.mjs \
  --platform devto \
  --content docs/marketing/external-posts/devto-ai-image-tools-comparison.md
```

## Publish after manual review

```bash
export ALLOW_EXTERNAL_PUBLISH=1
export BLUESKY_IDENTIFIER='your-handle.bsky.social'
export BLUESKY_APP_PASSWORD='use-an-app-password'
node scripts/publish-external.mjs --publish --platform bluesky \
  --content docs/marketing/external-posts/bluesky-comparisons-en.txt

export DEVTO_API_KEY='your-dev-api-key'
node scripts/publish-external.mjs --publish --platform devto \
  --content docs/marketing/external-posts/devto-ai-image-tools-comparison.md
```

On success the script prints the public post/article URL and appends a local record to `publish-log.jsonl`. The log is intentionally ignored by Git. Review platform rules, the final copy and the destination URL before using `--publish`.
