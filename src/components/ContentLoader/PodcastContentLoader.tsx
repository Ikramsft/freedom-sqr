import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';

type Props = any;

function PodcastContentLoader(props: Props) {
  return (
    <ContentLoader
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      height={170}
      speed={10}
      viewBox="0 0 474 170"
      {...props}>
      <Rect height="7" rx="0" ry="0" width="434" x="20" y="8" />
      <Rect height="10" rx="0" ry="0" width="434" x="20" y="36" />
      <Rect height="10" rx="0" ry="0" width="434" x="20" y="60" />
      <Rect height="50" rx="0" ry="0" width="100" x="90" y="90" />
      <Rect height="50" rx="0" ry="0" width="100" x="284" y="90" />
      <Rect height="2" rx="0" ry="0" width="434" x="20" y="160" />
    </ContentLoader>
  );
}

export {PodcastContentLoader};
