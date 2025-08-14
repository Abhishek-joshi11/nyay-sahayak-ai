import React, { useState, useEffect, useRef } from 'react';

// --- ICONS (Self-contained for portability) ---
const HomeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>);
const QnAIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.834 8.834 0 01-4.28-.99a.5.5 0 01-.22-.77l.99-1.72a.5.5 0 01.77-.22c.39.23.81.42 1.25.57A5.002 5.002 0 0010 13a5 5 0 005-5c0-2.485-2.236-4.5-5-4.5S5 5.515 5 8a.5.5 0 01-1 0c0-3.038 2.686-5.5 6-5.5s6 2.462 6 5.5z" clipRule="evenodd" /><path d="M10 11a2 2 0 100-4 2 2 0 000 4z" /></svg>);
const ExplainerIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 11-2 0V4H6a1 1 0 01-1-1z" clipRule="evenodd" /><path d="M10.707 3.293a1 1 0 010 1.414L6.414 9l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" /></svg>);
const DrafterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>);
const GuidesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.968 7.968 0 005.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.968 7.968 0 0014.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" /></svg>);
const ShareIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>);
const BotIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>);

// --- API SERVICE (Calls our secure backend) ---
const callGeminiAPI = async (prompt) => {
    const backendUrl = 'http://localhost:5001/api/gemini';
    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!response.ok) return { error: "The backend server responded with an error." };
        const result = await response.json();
        let jsonText = result.response;
        if (jsonText.startsWith("```json")) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith("```")) {
             jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Fetch call failed:", error);
        return { error: "Could not connect to the backend server. Is it running?" };
    }
};

// --- UI COMPONENTS ---
const Header = () => (
    <div className="bg-white shadow-md p-4 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center justify-center space-x-3">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center"><BotIcon /></div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Nyay Sahayak</h1>
                <p className="text-sm text-gray-500">Your AI Legal Information Assistant</p>
            </div>
        </div>
    </div>
);

const Navbar = ({ view, setView }) => {
    const navItems = [
        { id: 'home', icon: <HomeIcon />, label: 'Home' },
        { id: 'qna', icon: <QnAIcon />, label: 'Legal Q&A' },
        { id: 'guides', icon: <GuidesIcon />, label: 'Guides' },
        { id: 'explainer', icon: <ExplainerIcon />, label: 'Explainer' },
        { id: 'drafter', icon: <DrafterIcon />, label: 'Drafter' },
    ];
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-[92px] z-20">
            <div className="max-w-5xl mx-auto flex justify-center">
                {navItems.map(item => (
                    <button key={item.id} onClick={() => setView(item.id)} className={`flex items-center space-x-2 py-3 px-4 text-sm font-medium border-b-4 ${view === item.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

const LoadingIndicator = () => (
    <div className="flex items-center justify-center p-4"><div className="flex items-center space-x-2 text-gray-500"><div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div><div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div><div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div><span className="text-sm">Thinking...</span></div></div>
);

// --- SCREENS / VIEWS ---

const HomeScreen = ({ setView }) => (
    <div className="p-8 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to Nyay Sahayak</h2>
        <p className="mt-2 text-lg text-gray-600">Your AI-powered guide to understanding Indian law. Get clear information, not complicated jargon.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setView('qna')} className="p-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
                <QnAIcon />
                <h3 className="mt-2 text-xl font-semibold">Ask a Legal Question</h3>
                <p className="mt-1 text-sm">Get answers about any Indian law.</p>
            </button>
            <button onClick={() => setView('guides')} className="p-6 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                <GuidesIcon />
                <h3 className="mt-2 text-xl font-semibold">Know Your Rights Guides</h3>
                <p className="mt-1 text-sm">Step-by-step guides for common situations.</p>
            </button>
            <button onClick={() => setView('explainer')} className="p-6 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105">
                <ExplainerIcon />
                <h3 className="mt-2 text-xl font-semibold">Document Explainer</h3>
                <p className="mt-1 text-sm">Understand confusing legal clauses.</p>
            </button>
            <button onClick={() => setView('drafter')} className="p-6 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700 transition-transform transform hover:scale-105">
                <DrafterIcon />
                <h3 className="mt-2 text-xl font-semibold">Application Drafter</h3>
                <p className="mt-1 text-sm">Generate drafts for RTIs, complaints, etc.</p>
            </button>
        </div>
        <div className="mt-12 text-center bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm rounded-md p-3">
            <strong>Disclaimer:</strong> This is an informational tool and NOT a substitute for professional legal advice from a qualified lawyer.
        </div>
    </div>
);

const QnAScreen = () => {
    const [chatHistory, setChatHistory] = useState(() => JSON.parse(localStorage.getItem('nyay-sahayak-history')) || []);
    const [currentChat, setCurrentChat] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('nyay-sahayak-history', JSON.stringify(chatHistory));
    }, [chatHistory]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentChat]);

    const startNewChat = () => {
        if (currentChat.length > 0) {
            setChatHistory(prev => [currentChat, ...prev]);
        }
        setCurrentChat([]);
    };

    const loadChat = (index) => {
        startNewChat();
        setCurrentChat(chatHistory[index]);
        const newHistory = [...chatHistory];
        newHistory.splice(index, 1);
        setChatHistory(newHistory);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        const userMessage = { data: { text: input }, user: 'user' };
        const newChat = [...currentChat, userMessage];
        setCurrentChat(newChat);
        setInput('');
        setIsLoading(true);

        const prompt = `**System Prompt:** You are 'Nyay Sahayak'. **User's Question:** "${input}" **Your Task:** Respond in the structured JSON format with simplified_explanation, key_points, source, and practical_next_steps.`;
        const result = await callGeminiAPI(prompt);
        const botResponse = { data: result, user: 'bot' };
        setCurrentChat([...newChat, botResponse]);
        setIsLoading(false);
    };

    return (
        <div className="flex h-[calc(100vh-148px)]">
            <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b">
                    <button onClick={startNewChat} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">+ New Chat</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <h3 className="p-4 text-sm font-semibold text-gray-500">History</h3>
                    {chatHistory.map((chat, index) => (
                        <button key={index} onClick={() => loadChat(index)} className="w-full text-left p-3 text-sm text-gray-700 hover:bg-gray-200 truncate">
                            {chat[0]?.data?.text || "Untitled Chat"}
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-3/4 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                    {currentChat.length === 0 ? (<div className="text-center text-gray-500">Ask a question to start a conversation.</div>) : (currentChat.map((msg, index) => <ChatMessage key={index} message={msg} />))}
                    {isLoading && <LoadingIndicator />}
                    <div ref={chatEndRef} />
                </div>
                <div className="bg-white border-t p-4">
                    <form onSubmit={handleSend} className="flex items-center space-x-4">
                        <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about any Indian law..." className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button type="submit" className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-400" disabled={isLoading || !input.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const GuidesScreen = () => {
    const [guide, setGuide] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const scenarios = ["What to do during a traffic stop", "My rights if questioned by the police", "How to deal with a landlord over security deposit", "Steps to take for a faulty product or bad service", "How to handle online harassment or cyberbullying"];
    const fetchGuide = async (scenario) => {
        setIsLoading(true);
        setGuide(null);
        const prompt = `**System Prompt:** You are 'Nyay Sahayak'. **User Scenario:** "${scenario}" **Your Task:** Act as a guide. Generate a step-by-step guide for this situation in India. Respond in the structured JSON format with a simplified_explanation, key_points, a detailed source, and practical_next_steps.`;
        const result = await callGeminiAPI(prompt);
        setGuide({ data: result, user: 'bot' });
        setIsLoading(false);
    };
    return (<div className="p-8 max-w-4xl mx-auto"><h2 className="text-2xl font-bold text-center">Know Your Rights Guides</h2><p className="text-center text-gray-600 mt-1">Select a scenario to get a step-by-step guide.</p><div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">{scenarios.map((s, i) => (<button key={i} onClick={() => fetchGuide(s)} className="p-4 bg-white border rounded-lg hover:bg-gray-50 hover:border-green-500 text-left">{s}</button>))}</div>{isLoading && <LoadingIndicator />}{guide && <div className="mt-8"><ChatMessage message={guide} /></div>}</div>);
};

const ExplainerScreen = () => {
    const [clause, setClause] = useState('');
    const [explanation, setExplanation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleExplain = async () => {
        if (!clause.trim() || isLoading) return;
        setIsLoading(true);
        setExplanation(null);
        const prompt = `**System Prompt:** You are 'Nyay Sahayak'. **Legal Clause:** "${clause}" **Your Task:** Explain the clause in simple, plain English. Highlight any potential risks or important points. DO NOT give legal advice. Respond in a single JSON object with one key: "explanation".`;
        const result = await callGeminiAPI(prompt);
        setExplanation(result.explanation);
        setIsLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-center">Document Explainer</h2>
            <p className="text-center text-gray-600 mt-1">Paste a confusing clause from a contract or agreement below.</p>
            <textarea value={clause} onChange={(e) => setClause(e.target.value)} placeholder="e.g., 'The tenant agrees to waive their right to a notice period for eviction.'" className="w-full h-40 mt-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" disabled={isLoading} />
            <button onClick={handleExplain} className="mt-4 w-full bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-purple-700 disabled:bg-gray-400" disabled={isLoading || !clause.trim()}>Explain This Clause</button>
            {isLoading && <LoadingIndicator />}
            {explanation && (<div className="mt-8 p-4 bg-gray-100 rounded-lg border"><h3 className="font-bold text-gray-800 mb-2">Explanation:</h3><p className="text-gray-700 whitespace-pre-wrap">{explanation}</p></div>)}
        </div>
    );
};

const DrafterScreen = () => {
    const [description, setDescription] = useState('');
    const [draft, setDraft] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDraft = async () => {
        if (!description.trim() || isLoading) return;
        setIsLoading(true);
        setDraft(null);
        const prompt = `**System Prompt:** You are 'Nyay Sahayak'. **User's Description:** "${description}" **Your Task:** Draft a formal letter/application in English based on the user's need. Use placeholders like [Your Name], [Date], etc. Respond in a single JSON object with one key: "draft".`;
        const result = await callGeminiAPI(prompt);
        setDraft(result.draft);
        setIsLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-center">Application Drafter</h2>
            <p className="text-center text-gray-600 mt-1">Describe the letter or application you need to write.</p>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., 'I need to file an RTI with the Municipal Corporation about bad roads in my area.'" className="w-full h-32 mt-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" disabled={isLoading} />
            <button onClick={handleDraft} className="mt-4 w-full bg-yellow-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-yellow-700 disabled:bg-gray-400" disabled={isLoading || !description.trim()}>Draft Application</button>
            {isLoading && <LoadingIndicator />}
            {draft && (<div className="mt-8 p-4 bg-gray-100 rounded-lg border relative"><h3 className="font-bold text-gray-800 mb-2">Generated Draft:</h3><button onClick={() => navigator.clipboard.writeText(draft)} className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold py-1 px-2 rounded">Copy</button><pre className="text-gray-700 whitespace-pre-wrap font-sans bg-white p-3 rounded-md mt-2">{draft}</pre></div>)}
        </div>
    );
};

// --- HELPER & GENERIC COMPONENTS ---
const ShareButton = ({ messageData }) => {
    const [copied, setCopied] = useState(false);
    const handleShare = () => {
        const shareText = `Nyay Sahayak AI Response:\n-------------------------\nSummary: ${messageData.simplified_explanation}\n\nKey Points:\n${messageData.key_points.map(p => `- ${p}`).join('\n')}\n\nNext Steps:\n${messageData.practical_next_steps.map(s => `- ${s}`).join('\n')}\n\nSource: ${messageData.source}\n-------------------------\nShared from Nyay Sahayak. Not legal advice.`;
        navigator.clipboard.writeText(shareText.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (<button onClick={handleShare} className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 text-xs font-semibold py-1 px-2 rounded-full flex items-center space-x-1"><ShareIcon /><span>{copied ? 'Copied!' : 'Share'}</span></button>);
};

const ChatMessage = ({ message }) => {
    const { data, user } = message;
    if (user !== 'bot') {
        return (<div className="flex items-start gap-3 my-4 justify-end"><div className="p-4 rounded-2xl max-w-lg bg-blue-600 text-white rounded-br-none"><p className="text-base">{data.text}</p></div><div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center"><UserIcon /></div></div>);
    }
    if (data.simplified_explanation) {
        return (<div className="flex items-start gap-3 my-4 justify-start"><div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center"><BotIcon /></div><div className="relative p-4 rounded-2xl max-w-2xl bg-gray-100 text-gray-800 rounded-bl-none w-full"><ShareButton messageData={data} /><p className="text-base font-semibold italic border-l-4 border-blue-500 pl-3">"{data.simplified_explanation}"</p><div className="mt-4"><h4 className="font-bold text-sm text-gray-600">Key Points:</h4><ul className="list-disc list-inside mt-1 space-y-1 text-base">{data.key_points?.map((p, i) => <li key={i}>{p}</li>)}</ul></div><div className="mt-4"><h4 className="font-bold text-sm text-gray-600">Practical Next Steps:</h4><ul className="list-decimal list-inside mt-1 space-y-1 text-base">{data.practical_next_steps?.map((s, i) => <li key={i}>{s}</li>)}</ul></div>{data.source && (<div className="mt-4 pt-3 border-t border-gray-300"><p className="text-xs text-gray-500 font-semibold">Source: <span className="font-normal">{data.source}</span></p></div>)}</div></div>);
    }
    return (<div className="flex items-start gap-3 my-4 justify-start"><div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center"><BotIcon /></div><div className="p-4 rounded-2xl max-w-lg bg-gray-100 text-gray-800 rounded-bl-none"><p className="text-base">{data.text}</p>{data.source && (<div className="mt-3 pt-2 border-t border-gray-300"><p className="text-xs text-gray-500 font-semibold">Source: <span className="font-normal">{data.source}</span></p></div>)}</div></div>);
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [view, setView] = useState('home'); // home, qna, explainer, drafter, guides

    const renderView = () => {
        switch (view) {
            case 'qna': return <QnAScreen />;
            case 'guides': return <GuidesScreen />;
            case 'explainer': return <ExplainerScreen />;
            case 'drafter': return <DrafterScreen />;
            case 'home':
            default:
                return <HomeScreen setView={setView} />;
        }
    };

    return (
        <div className="font-sans bg-gray-100 flex flex-col h-screen">
            <Header />
            <Navbar view={view} setView={setView} />
            <main className="flex-1 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
}
