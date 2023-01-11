import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';

type Props = any;

function ResourceContentLoader(props: Props) {
  return (
    <ContentLoader
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      height={124}
      speed={10}
      viewBox="0 0 476 124"
      {...props}>
      <Rect height="105" rx="5" ry="5" width="100" x="20" y="20" />
      <Rect height="16" rx="0" ry="0" width="230" x="140" y="36" />
      <Rect height="40" rx="5" ry="5" width="100" x="140" y="72" />
    </ContentLoader>
  );
}

export {ResourceContentLoader};
