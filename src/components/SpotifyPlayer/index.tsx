export type IPlayerParams = {
  uri: string;
};

function SpotifyPlayer(params: IPlayerParams) {
  const {uri} = params || {};

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>player</title>

  </head>
  <body>
  <iframe
  src=${uri}
  width="100%"
  height="100"
  frameborder="0"
  allowtransparency="true"
></iframe>

  </body>
  </html>`;
}

export {SpotifyPlayer};
export * from './SpotifyPlayerContainer';
