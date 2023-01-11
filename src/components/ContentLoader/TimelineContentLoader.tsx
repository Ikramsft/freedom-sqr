import React from 'react';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';

type Props = any;

function TimelineContentLoader(props: Props) {
  return (
    <ContentLoader
      backgroundColor="#b4b4b4"
      foregroundColor="#d2d2d2"
      height={150}
      speed={2}
      viewBox="0 0 476 150"
      {...props}>
      <Rect height="16" rx="0" ry="0" width="16" x="16" y="16" />
      <Rect height="90" rx="0" ry="0" width="1" x="24" y="40" />
      <Rect height="8" rx="0" ry="0" width="90" x="48" y="20" />
      <Rect height="8" rx="0" ry="0" width="275" x="48" y="50" />
      <Rect height="8" rx="0" ry="0" width="275" x="48" y="70" />
      <Rect height="8" rx="0" ry="0" width="275" x="48" y="90" />
      <Rect height="8" rx="0" ry="0" width="60" x="48" y="110" />
      <Circle cx="124" cy="115" r="2" />
      <Rect height="6" rx="0" ry="0" width="100" x="140" y="112" />
      <Rect height="100" rx="5" ry="5" width="100" x="356" y="16" />
      <Rect height="1" rx="0" ry="0" width="432" x="24" y="140" />
    </ContentLoader>
  );
}

export {TimelineContentLoader};
