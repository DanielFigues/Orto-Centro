export interface FaqItem {
  id: string
  question: string
  /** TODO: substitua pelo texto real da loja. */
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    id: 'entrega',
    question: 'Vocês entregam?',
    answer:
      '...',
  },
  {
    id: 'receita',
    question: 'Preciso de receita?',
    answer:
      '...',
  },
  {
    id: 'tamanho',
    question: 'Como sei qual tamanho escolher?',
    answer:
      '...',
  },
  {
    id: 'garantia',
    question: 'Os produtos têm garantia?',
    answer:
      '...',
  },
]
