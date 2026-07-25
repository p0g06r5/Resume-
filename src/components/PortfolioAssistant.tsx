import { Fragment, type ReactNode, FormEvent, useEffect, useRef, useState } from 'react';
import { topics } from '../data/assistant';

type Message = { role: 'assistant' | 'user'; text: string; suggestions?: string[] };
type ApiMessage = { role: 'assistant' | 'user'; content: string };

type SuggestionCardProps = {
  question: string;
  icon: string;
  disabled?: boolean;
  variant?: 'starter' | 'related';
  onClick: () => void;
};

const API_URL = import.meta.env.VITE_ASSISTANT_API_URL?.trim();
const starterQuestions = [
  'Why should I hire Pawan?',
  'Tell me about Pawan’s strongest project.',
  'What AI experience does Pawan have?',
  'Summarize Pawan’s technical strengths.'
];
const initialAssistantText = [
  'Hi! I’m Pawan’s AI assistant.',
  '',
  'I can answer questions about his experience, projects, leadership, technical skills, and education.'
].join('\n');
const initialMessage: Message = {
  role: 'assistant',
  text: initialAssistantText,
  suggestions: starterQuestions
};

function SuggestionCard({ question, icon, disabled = false, variant = 'starter', onClick }: SuggestionCardProps) {
  return (
    <button
      type="button"
      className={`suggestion-card suggestion-card--${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Ask: ${question}`}
    >
      <span className="suggestion-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="suggestion-label">{question}</span>
    </button>
  );
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
}

export function renderMessageContent(text: string): ReactNode {
  const paragraphs = text
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean);

  return (
    <div className="message-content">
      {paragraphs.map((paragraph, index) => {
        const lines = paragraph.split('\n').map(line => line.trim()).filter(Boolean);
        const isList = lines.some(line => /^[-•]\s/.test(line) || /^\d+\.\s/.test(line));

        if (isList) {
          return (
            <ul key={`paragraph-${index}`}>
              {lines.map((line, lineIndex) => {
                const cleaned = line.replace(/^[-•]\s/, '').replace(/^\d+\.\s/, '');
                return <li key={`${index}-${lineIndex}`}>{renderInlineMarkdown(cleaned)}</li>;
              })}
            </ul>
          );
        }

        return <p key={`paragraph-${index}`}>{renderInlineMarkdown(paragraph.replace(/\n/g, ' '))}</p>;
      })}
    </div>
  );
}

function SuggestionList({
  questions,
  disabled,
  variant = 'starter',
  onSelect
}: {
  questions: string[];
  disabled: boolean;
  variant?: 'starter' | 'related';
  onSelect: (question: string) => void;
}) {
  const getIcon = (question: string) => {
    const normalized = question.toLowerCase();
    if (normalized.includes('hire')) return '💼';
    if (normalized.includes('project') || normalized.includes('architecture')) return '🚀';
    if (normalized.includes('ai') || normalized.includes('tool')) return '🧠';
    if (normalized.includes('technologies') || normalized.includes('business')) return '⚙️';
    return '📈';
  };

  return (
    <div className="suggestion-list" role="list">
      {questions.map(question => (
        <SuggestionCard
          key={question}
          question={question}
          icon={getIcon(question)}
          disabled={disabled}
          variant={variant}
          onClick={() => onSelect(question)}
        />
      ))}
    </div>
  );
}

function getRelatedQuestions(input: string, answer?: string) {
  const source = `${input}\n${answer ?? ''}`.toLowerCase();
  const currentQuestion = input.trim().toLowerCase();

  const buildSuggestions = (suggestions: string[]) =>
    suggestions.filter(suggestion => suggestion.toLowerCase() !== currentQuestion);

  if (/(project|business|problem|portal|auto|check)/.test(source)) {
    return buildSuggestions([
      'What technologies were used?',
      'What business problem did it solve?'
    ]);
  }

  if (/(ai|artificial|machine learning|testing|tool|assistant)/.test(source)) {
    return buildSuggestions([
      'How does Pawan use AI in testing?',
      'What AI tools has he worked with?',
      'Tell me about an AI project he built.'
    ]);
  }

  if (/(lead|leadership|mentor|team|engineer|manager)/.test(source)) {
    return buildSuggestions([
      'How many engineers has Pawan led?',
      'What is his leadership style?',
      'How does he mentor engineers?'
    ]);
  }

  if (/(hire|hiring|candidate|opportunity|experience|skills|strongest)/.test(source)) {
    return buildSuggestions([
      'What are Pawan’s strongest skills?',
      'What industries has he worked in?',
      'What makes him different from other candidates?'
    ]);
  }

  if (/(education|study|degree|university|college|school)/.test(source)) {
    return buildSuggestions([
      'Where did Pawan study?',
      'What did he study?',
      'When did he complete his degrees?'
    ]);
  }

  return buildSuggestions([
    'Tell me about Pawan’s strongest project.',
    'What are his strongest technical skills?',
    'Why should I hire Pawan?'
  ]);
}

export function PortfolioAssistant() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [notice, setNotice] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const appendFallbackAnswer = (question: string) => {
    const matchingTopic = Object.values(topics).find(
      topic => topic.answer && topic.label.toLowerCase() === question.toLowerCase()
    );

    const fallbackAnswer =
      matchingTopic?.answer ??
      'The live AI service is not connected yet. Please use one of the suggested portfolio questions, or contact Pawan directly for more details.';

    setMessages(current => [
      ...current,
      {
        role: 'assistant',
        text: fallbackAnswer,
        suggestions: getRelatedQuestions(question, fallbackAnswer)
      }
    ]);
  };

  const sendMessage = async (question: string) => {
    const cleaned = question.trim();
    if (!cleaned || busy) return;

    const userMessage: Message = { role: 'user', text: cleaned };
    const conversation = [...messages, userMessage];

    setMessages(conversation);
    setInput('');
    setBusy(true);
    setNotice(null);

    if (!API_URL) {
      window.setTimeout(() => {
        appendFallbackAnswer(cleaned);
        setNotice('Demo mode: deploy the included Cloudflare Worker and set VITE_ASSISTANT_API_URL to enable live AI.');
        setBusy(false);
      }, 350);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = conversation.filter((message, index) => !(index === 0 && message.role === 'assistant' && message.text === initialAssistantText));
      const apiMessages: ApiMessage[] = history.slice(-8).map(message => ({ role: message.role, content: message.text }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Assistant request failed with status ${response.status}`);
      }

      if (!response.body) {
        const data = (await response.json()) as { answer?: string };
        const answer = data.answer ?? 'I could not generate an answer.';
        setMessages(current => {
          const updated = [...current];
          updated[updated.length - 1] = {
            role: 'assistant',
            text: answer,
            suggestions: getRelatedQuestions(cleaned, answer)
          };
          return updated;
        });
        return;
      }

      setMessages(current => [...current, { role: 'assistant', text: '' }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let answer = '';
      let buffer = '';

      const updateAssistantMessage = (nextAnswer: string) => {
        setMessages(current => {
          const updated = [...current];
          updated[updated.length - 1] = {
            role: 'assistant',
            text: nextAnswer
          };
          return updated;
        });
      };

      while (true) {
        const { value, done } = await reader.read();

        buffer += decoder.decode(value ?? new Uint8Array(), {
          stream: !done
        });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const rawLine of lines) {
          const line = rawLine.trim();

          if (!line.startsWith('data:')) continue;

          const payload = line.slice(5).trim();

          if (!payload || payload === '[DONE]') continue;

          try {
            const data = JSON.parse(payload) as {
              choices?: Array<{
                delta?: {
                  content?: string;
                };
              }>;
            };

            const content = data.choices?.[0]?.delta?.content;

            if (content) {
              answer += content;
              updateAssistantMessage(answer);
            }
          } catch {
            // Ignore malformed or incomplete SSE events.
          }
        }

        if (done) break;
      }

      if (!answer.trim()) {
        answer = 'I could not generate an answer.';
      }

      setMessages(current => {
        const updated = [...current];
        updated[updated.length - 1] = {
          role: 'assistant',
          text: answer,
          suggestions: getRelatedQuestions(cleaned, answer)
        };
        return updated;
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setMessages(current => {
          const updated = [...current];
          updated[updated.length - 1] = {
            role: 'assistant',
            text: 'I’m temporarily unavailable. You can still browse Pawan’s portfolio, download his résumé, or contact him directly.'
          };
          return updated;
        });
        setNotice('The live assistant could not be reached.');
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
    }
  };

  const sendSuggestion = (question: string) => {
    void sendMessage(question);
  };

  const restart = () => {
    abortRef.current?.abort();
    setMessages([initialMessage]);
    setInput('');
    setNotice(null);
    setBusy(false);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const hasUserMessages = messages.some(message => message.role === 'user');

  return (
    <>
      <button
        className="chat-launcher"
        aria-expanded={open}
        aria-controls="portfolio-assistant"
        onClick={() => setOpen(value => !value)}
      >
        ✨ <span>Ask Pawan AI</span>
      </button>

      {open && (
        <aside id="portfolio-assistant" className="chat-panel" aria-label="Ask Pawan AI portfolio assistant">
          <header className="chat-header">
            <div>
              <strong>Ask Pawan AI</strong>
              <small>Answers only from this portfolio</small>
            </div>
            <div>
              <button type="button" onClick={restart} aria-label="Restart conversation">↻</button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">×</button>
            </div>
          </header>

          <div className="chat-body" aria-live="polite">
            {messages.map((message, index) => {
              const latestAssistantMessage = messages[messages.length - 1];
              const showRelatedQuestions =
                message.role === 'assistant' &&
                index > 0 &&
                message.suggestions?.length &&
                latestAssistantMessage?.role === 'assistant' &&
                latestAssistantMessage === message &&
                !busy;

              return (
                <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
                  {message.text ? (
                    renderMessageContent(message.text)
                  ) : (
                    <span className="stream-cursor" aria-label="Assistant is responding" />
                  )}
                  {message.role === 'assistant' && index === 0 && !hasUserMessages ? (
                    <div className="welcome-suggestions">
                      <SuggestionList questions={message.suggestions ?? []} disabled={busy} variant="starter" onSelect={sendSuggestion} />
                    </div>
                  ) : null}
                  {showRelatedQuestions ? (
                    <div className="related-questions">
                      <div className="related-heading">Related questions</div>
                      <SuggestionList questions={message.suggestions ?? []} disabled={busy} variant="related" onSelect={sendSuggestion} />
                    </div>
                  ) : null}
                </div>
              );
            })}
            {busy && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="message assistant typing" aria-label="Assistant is typing"><i /><i /><i /></div>
            )}
            <div ref={endRef} />
          </div>

          {notice && <p className="chat-notice">{notice}</p>}

          <form className="chat-input" onSubmit={submit}>
            <label className="sr-only" htmlFor="portfolio-question">Ask about Pawan’s portfolio</label>
            <input
              id="portfolio-question"
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Ask about Pawan’s experience..."
              maxLength={600}
              disabled={busy}
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send question">Send</button>
          </form>
          <small className="ai-disclosure">AI-generated answers may contain mistakes. Verify important details in the résumé.</small>
        </aside>
      )}
    </>
  );
}
