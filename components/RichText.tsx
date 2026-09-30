import Markdoc, { type Node } from '@markdoc/markdoc';
import React from 'react';

export async function RichText({ content }: { content: () => Promise<{ node: Node }> }) {
  const { node } = await content();
  const tree = Markdoc.transform(node);
  return <div className="prose">{Markdoc.renderers.react(tree, React)}</div>;
}
