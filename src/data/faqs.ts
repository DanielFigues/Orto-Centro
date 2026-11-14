// FAQ content supplied by the client (FAQs_Orto_Centro.docx).
// `question`, `body` and `notes` are the client's wording, unchanged.
// `lead` is a one-line teaser drafted for the collapsed state: TODO client must approve.

export type FaqGroupId =
  | "antes-da-compra"
  | "pagamento-e-entrega"
  | "pos-venda"
  | "a-loja";

export interface FaqGroup {
  id: FaqGroupId;
  title: string;
}

export interface FaqNote {
  label: string;
  text: string;
}

export interface FaqItem {
  /** Stable slug, used for deep links: /perguntas-frequentes#<id> */
  id: string;
  group: FaqGroupId;
  question: string;
  /** Teaser shown under the question while collapsed (replaced by the full answer when open). */
  lead: string;
  /** Full answer, one string per paragraph. */
  body: string[];
  /** Callouts shown after the body (e.g. "Importante"). */
  notes?: FaqNote[];
  /** Shown on the home page. */
  featured?: boolean;
}

export const faqGroups: FaqGroup[] = [
  { id: "antes-da-compra", title: "Antes da compra" },
  { id: "pagamento-e-entrega", title: "Nota fiscal e entrega" },
  { id: "pos-venda", title: "Trocas, garantia e manutenção" },
  { id: "a-loja", title: "A loja" },
];

export const faqs: FaqItem[] = [
  {
    id: "precisa-de-receita",
    group: "antes-da-compra",
    featured: true,
    question: "Preciso de receita?",
    lead: "Não é obrigatória, mas recomendamos a orientação de um médico ou fisioterapeuta.",
    body: [
      "Não há obrigatoriedade de apresentar receita para adquirir nossos produtos. Ainda assim, recomendamos sempre a orientação de um médico ou fisioterapeuta para garantir que o modelo escolhido seja o mais indicado para a sua necessidade. Se você já tiver prescrição, compartilhe com nossa equipe para auxiliarmos na escolha exata do item.",
    ],
  },
  {
    id: "como-escolher-o-tamanho",
    group: "antes-da-compra",
    featured: true,
    question: "Como escolher o tamanho correto?",
    lead: "O mais seguro é experimentar o item de demonstração na loja, com a ajuda dos atendentes.",
    body: [
      "As medidas variam conforme o modelo e o fabricante. A forma mais segura de acertar na escolha é experimentar o item de demonstração em nossa loja com o auxílio de nossos atendentes.",
      "Se não puder comparecer, fale conosco antes da compra para receber orientação de medidas e a tabela do fabricante. Como a medição é feita pelo próprio comprador, a escolha final do tamanho é de responsabilidade do cliente. Confira tudo com atenção: por segurança sanitária, não trocamos produtos médicos.",
    ],
  },
  {
    id: "produtos-para-locacao",
    group: "antes-da-compra",
    featured: true,
    question: "Quais produtos vocês alugam?",
    lead: "Cama hospitalar, cadeira de rodas, cadeira de banho, muleta axilar e andador.",
    body: [
      "Disponibilizamos para locação: cama hospitalar, cadeira de rodas, cadeira de banho, muleta axilar e andador. Entre em contato com nossa equipe pelo telefone ou WhatsApp para consultar a disponibilidade imediata, os prazos e as condições de locação.",
    ],
  },
  {
    id: "nota-fiscal-e-reembolso",
    group: "pagamento-e-entrega",
    question:
      "Vocês emitem Nota Fiscal para reembolso em plano de saúde ou imposto de renda?",
    lead: "Sim, em todas as vendas. Informe os dados necessários antes de finalizar a compra.",
    body: [
      "Sim. Emitimos Nota Fiscal no ato de todas as vendas (e fatura/recibo nas locações). Se precisar da nota no CPF do paciente ou com dados específicos no campo de observações para reembolso no plano de saúde (como nome do beneficiário, CRM do médico ou dados do convênio), informe tudo antes da finalização da compra.",
    ],
    notes: [
      {
        label: "Importante",
        text: "Conforme as normas fiscais vigentes, não realizamos emissões posteriores, inclusões de observações nem alterações cadastrais após a emissão do documento.",
      },
    ],
  },
  {
    id: "entrega",
    group: "pagamento-e-entrega",
    featured: true,
    question: "Vocês entregam?",
    lead: "Sim, na área urbana de Montes Claros, só para produtos comprados. O frete é combinado antes do pedido.",
    body: [
      "Sim, realizamos entregas na área urbana de Montes Claros exclusivamente para produtos comprados. Pode haver cobrança de frete, mas o valor da taxa de entrega será sempre informado e acordado antes do fechamento do pedido, conforme o endereço. Para equipamentos alugados ou em manutenção, a retirada e a devolução são feitas exclusivamente em nossa loja (pelo cliente ou por portador autorizado).",
    ],
  },
  {
    id: "trocas-e-devolucoes",
    group: "pos-venda",
    featured: true,
    question:
      "Posso devolver ou trocar produtos que comprei e levei para experimentar?",
    lead: "Por segurança sanitária, não fazemos trocas ou devoluções por tamanho, modelo ou conveniência. Defeitos de fabricação têm garantia de 90 dias.",
    body: [
      "Por questões rigorosas de segurança sanitária e normas da Anvisa, não realizamos trocas ou devoluções por motivo de tamanho, modelo ou conveniência de produtos médicos e ortopédicos após a compra. Como esses itens entram em contato direto com a pele — muitas vezes em regiões com feridas, curativos ou secreções —, essa medida garante a você e a todos os nossos clientes a certeza de adquirir um produto 100% novo, íntegro e livre de qualquer risco de contaminação.",
    ],
    notes: [
      {
        label: "Defeitos de fabricação",
        text: "Caso o produto apresente qualquer defeito de fabricação, sua garantia legal de 90 dias (Art. 26 do CDC) está totalmente assegurada.",
      },
    ],
  },
  {
    id: "garantia",
    group: "pos-venda",
    question: "Os produtos têm garantia?",
    lead: "Sim: garantia legal de 90 dias contra defeitos de fabricação, mediante nota fiscal.",
    body: [
      "Sim. Trabalhamos exclusivamente com produtos originais e regularizados pela ANVISA e/ou INMETRO. Todos contam com a garantia legal de 90 dias contra defeitos de fabricação (além da garantia estendida do fabricante, quando houver), mediante apresentação da nota fiscal. A garantia não cobre danos por mau uso ou desgaste natural das peças.",
    ],
  },
  {
    id: "manutencao-e-conserto",
    group: "pos-venda",
    question: "Vocês realizam manutenção ou conserto de equipamentos?",
    lead: "Sim. Somos assistência técnica autorizada da Freedom e outras marcas, com oficina própria.",
    body: [
      "Sim. Somos assistência técnica autorizada da Freedom e outras marcas, com oficina especializada própria. Realizamos avaliação e manutenção de equipamentos médico-hospitalares e de mobilidade (como cadeiras de rodas, cadeiras de banho, andadores e muletas), sujeita à análise técnica e disponibilidade de peças. Para avaliação ou atendimento em garantia (mediante nota fiscal), o equipamento deve ser trazido à nossa loja. Entre em contato para verificarmos seu caso específico.",
    ],
  },
  {
    id: "endereco-e-estacionamento",
    group: "a-loja",
    question: "Qual o endereço da loja e vocês têm estacionamento?",
    lead: "Av. Mestra Fininha, 565, em frente ao Laboratório da Santa Casa. Estacionamento próprio atrás da loja.",
    body: [
      "Estamos na Av. Mestra Fininha, 565 (em frente ao Laboratório da Santa Casa), em Montes Claros. Dispomos de estacionamento próprio atrás da loja, com entrada pela Rua Barão do Rio Branco, facilitando o acesso e a retirada de equipamentos.",
    ],
  },
];

export const featuredFaqs = faqs.filter((faq) => faq.featured);
