import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler';

addEventListener("fetch", event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
   return await getAssetFromKV(event, { mapRequestToAsset: serveSinglePageApp });
}