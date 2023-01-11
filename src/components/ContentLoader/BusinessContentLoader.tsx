import React from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';

type Props = any;

function BusinessContentLoader(props: Props) {
  return (
    <ContentLoader
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      height={350}
      speed={10}
      viewBox="0 0 440 350"
      {...props}>
      <Rect height="180" rx="5" ry="5" width="180" x="8" y="10" />
      <Rect height="10" rx="0" ry="0" width="142" x="8" y="200" />
      <Rect height="8" rx="0" ry="0" width="180" x="8" y="220" />
      <Rect height="8" rx="0" ry="0" width="180" x="8" y="236" />
      <Rect height="8" rx="0" ry="0" width="180" x="8" y="252" />
      <Rect height="2" rx="0" ry="0" width="180" x="8" y="270" />
      <Rect height="50" rx="0" ry="0" width="150" x="20" y="290" />
      <Rect height="6" rx="0" ry="0" width="0" x="128" y="312" />

      <Rect height="180" rx="0" ry="0" width="180" x="228" y="10" />
      <Rect height="10" rx="0" ry="0" width="142" x="228" y="198" />
      <Rect height="8" rx="0" ry="0" width="180" x="228" y="227" />
      <Rect height="8" rx="0" ry="0" width="180" x="228" y="243" />
      <Rect height="8" rx="0" ry="0" width="180" x="228" y="258" />
      <Rect height="2" rx="0" ry="0" width="201" x="228" y="276" />
      <Rect height="50" rx="0" ry="0" width="150" x="240" y="290" />
      <Rect height="6" rx="0" ry="0" width="0" x="328" y="312" />
    </ContentLoader>
  );
}

export {BusinessContentLoader};
