// Small helpers to build Lexical rich-text trees for seed content without the
// verbose node boilerplate. These produce the same JSON shape Payload's Lexical
// editor stores; they are seed tooling only (no runtime/block logic).

type LexicalNode = {
  type: string
  version: number
  [k: string]: unknown
}

type LexicalRoot = {
  root: {
    type: 'root'
    children: LexicalNode[]
    direction: 'ltr'
    format: ''
    indent: 0
    version: 1
  }
}

const textNode = (text: string): LexicalNode => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

export const heading = (text: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2'): LexicalNode => ({
  type: 'heading',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  tag,
  version: 1,
})

export const paragraph = (text: string): LexicalNode => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

// Wrap nodes into a complete Lexical editor state (a rich-text field value).
export const richText = (...children: LexicalNode[]): LexicalRoot => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})
