import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from './ui';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const faqQuestions = [
  {
    id: 1,
    question: 'Como começar a investir?',
    answer: 'Para começar, recomendo investimentos de baixo risco como Tesouro Selic ou CDB. Na aba Investir, você encontra opções a partir de R$50. Comece com valores pequenos e vá aumentando conforme ganha confiança.',
  },
  {
    id: 2,
    question: 'Qual a diferença entre baixo, médio e alto risco?',
    answer: 'Baixo risco: investimentos mais seguros com retorno previsível (Tesouro, CDB). Médio risco: fundos diversificados com melhor retorno, mas alguma variação. Alto risco: ações e cripto com potencial alto, mas volatilidade.',
  },
  {
    id: 3,
    question: 'Quanto devo investir?',
    answer: 'Recomendo guardar 3-6 meses de despesas como reserva de emergência em Tesouro Selic primeiro. Depois, invista 10-20% da sua renda mensal. Comece pequeno e vá aumentando gradualmente.',
  },
  {
    id: 4,
    question: 'Como fazer PIX?',
    answer: 'Na tela inicial, clique em "PIX" nas ações rápidas. Você pode enviar PIX informando a chave do destinatário e valor, ou receber compartilhando sua chave ou QR Code.',
  },
  {
    id: 5,
    question: 'Como resgatar cashback?',
    answer: 'Clique em "Cashback" nas ações rápidas. Você verá seu saldo disponível e pode escolher entre resgate direto na conta ou usar para pagar contas.',
  },
  {
    id: 6,
    question: 'Como criar uma meta?',
    answer: 'Na aba "Metas", clique no botão "+". Defina o nome da meta, valor objetivo e escolha um ícone. Depois, você pode adicionar dinheiro à meta usando seu saldo disponível.',
  },
];

export default function AIAssistant({ isOpenExternal, onOpenChange }) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Olá! 👋 Sou seu assistente financeiro com IA. Como posso ajudar você hoje?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Usar controle externo se fornecido, senão usar estado interno
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;
  const setIsOpen = onOpenChange || setIsOpenInternal;

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Adiciona mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    // Simula resposta da IA
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage);
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        text: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 800);

    setInputMessage('');
  };

  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase();

    // Busca por palavras-chave nas FAQs
    if (input.includes('investir') || input.includes('começar')) {
      return faqQuestions[0].answer;
    } else if (input.includes('risco')) {
      return faqQuestions[1].answer;
    } else if (input.includes('quanto') || input.includes('valor')) {
      return faqQuestions[2].answer;
    } else if (input.includes('pix')) {
      return faqQuestions[3].answer;
    } else if (input.includes('cashback')) {
      return faqQuestions[4].answer;
    } else if (input.includes('meta')) {
      return faqQuestions[5].answer;
    } else if (input.includes('cartão') || input.includes('cartao')) {
      return 'Na aba "Cartões", você pode visualizar seus cartões virtuais e físicos, copiar números, bloquear ou solicitar novos cartões. Clique no ícone de olho para ver dados completos.';
    } else if (input.includes('saldo') || input.includes('dinheiro')) {
      return 'Você pode ver seu saldo total na tela inicial. Para aumentar seu saldo, considere investir em opções que rendem acima da poupança, como CDB ou Tesouro Direto.';
    } else {
      return 'Posso ajudar com dúvidas sobre investimentos, PIX, cashback, metas, cartões e muito mais. Que tal escolher uma das perguntas frequentes abaixo?';
    }
  };

  const handleQuickQuestion = (question) => {
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: question.question,
      timestamp: new Date(),
    };

    const aiMessage = {
      id: messages.length + 2,
      type: 'ai',
      text: question.answer,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, aiMessage]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-full max-w-sm animate-slide-up">
          <Card className="shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-xl pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Assistente IA</CardTitle>
                  <p className="text-xs text-blue-100">Sempre online para ajudar</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-4 space-y-3 bg-[hsl(var(--background))]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Questions */}
              {messages.length <= 1 && (
                <div className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                  <p className="text-xs text-gray-400 mb-2">Perguntas frequentes:</p>
                  <div className="space-y-2">
                    {faqQuestions.slice(0, 3).map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleQuickQuestion(q)}
                        className="w-full text-left text-xs bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-300 transition-colors"
                      >
                        {q.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua dúvida..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    disabled={!inputMessage.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
