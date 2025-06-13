import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Code2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setReview("");
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      const data = response.data;
      setReview(data.suggestion || "No suggestion received.");
    } catch (error) {
      console.error("Error during AI review:", error);
      setReview("❌ Error fetching review. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background SVG dots */}
      <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-20'></div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto mb-8">
        <div className="text-center py-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-slate-900 p-3 rounded-full">
                <Code2 className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Code Review
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get instant, intelligent feedback on your code with AI-powered
            analysis
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left - Input */}
            <div className="lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-slate-700/50">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg mr-3">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Your Code</h2>
              </div>

              <div className="relative group">
                <textarea
                  className="w-full h-80 p-4 bg-slate-900/80 border border-slate-600/50 rounded-xl font-mono text-sm text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 group-hover:border-slate-500/50"
                  placeholder={`// Paste your code here...
function example() {
  console.log('Hello, world!');
}`}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <div className="absolute top-3 right-3 text-xs text-slate-500 bg-slate-800/80 px-2 py-1 rounded">
                  {code.split("\n").length} lines
                </div>
              </div>

              <button
                onClick={handleReview}
                disabled={loading || !code.trim()}
                className="group mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/25"
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Code...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                      Get AI Review
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Right - Output */}
            <div className="lg:w-1/2 p-8 flex flex-col">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg mr-3">
                  {review && !loading ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  AI Analysis
                </h2>
              </div>

              <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-600/50 overflow-hidden">
                <div className="h-full overflow-y-auto p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-500 rounded-full animate-spin animation-delay-150"></div>
                      </div>
                      <p className="text-lg font-medium">
                        Analyzing your code...
                      </p>
                      <p className="text-sm opacity-75 mt-2">
                        This may take a few moments
                      </p>
                    </div>
                  ) : review ? (
                    <div className="prose prose-invert prose-purple max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <div className="rounded-lg overflow-hidden border border-slate-600/50 my-4">
                                <SyntaxHighlighter
                                  language={match[1]}
                                  style={oneDark}
                                  PreTag="div"
                                  customStyle={{
                                    margin: 0,
                                    borderRadius: 0,
                                    background: "rgba(15, 23, 42, 0.8)",
                                  }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code
                                className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-slate-600/50">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-semibold text-slate-200 mb-3 mt-6">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-medium text-slate-300 mb-2 mt-4">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-slate-300 mb-4 leading-relaxed">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-slate-300">{children}</li>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-500/10 rounded-r-lg mb-4">
                              {children}
                            </blockquote>
                          ),
                          strong: ({ children }) => (
                            <strong className="text-purple-300 font-semibold">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {review}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-600/30 text-center max-w-md">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                        <h3 className="text-lg font-medium text-slate-300 mb-2">
                          Ready for Analysis
                        </h3>
                        <p className="text-sm text-slate-400">
                          Paste your code and click "Get AI Review" to receive
                          intelligent feedback and suggestions.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-7xl mx-auto mt-8 text-center">
        <p className="text-slate-400 text-sm">
          Powered by AI • Get instant code reviews and improvements
        </p>
      </div>
    </div>
  );
}

export default App;

// import { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import {
//   Code2,
//   Sparkles,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
// } from "lucide-react";

// function App() {
//   const [code, setCode] = useState("");
//   const [review, setReview] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleReview = async () => {
//     setLoading(true);
//     setReview("");
//     try {
//       const res = await fetch("http://localhost:3000/ai/get-review", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ code }),
//       });
//       const data = await res.json();
//       setReview(data.suggestion || "No suggestion received.");
//     } catch (err) {
//       setReview("Error fetching review.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
//       {/* Background Effects */}
//       <div
//         className="absolute inset-0 opacity-20"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//         }}
//       ></div>

//       {/* Header */}
//       <div className="relative z-10 max-w-7xl mx-auto mb-8">
//         <div className="text-center py-8">
//           <div className="flex items-center justify-center mb-4">
//             <div className="relative">
//               <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
//               <div className="relative bg-slate-900 p-3 rounded-full">
//                 <Code2 className="w-8 h-8 text-purple-400" />
//               </div>
//             </div>
//           </div>
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
//             AI Code Review
//           </h1>
//           <p className="text-xl text-slate-300 max-w-2xl mx-auto">
//             Get instant, intelligent feedback on your code with AI-powered
//             analysis
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 max-w-7xl mx-auto">
//         <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
//           <div className="flex flex-col lg:flex-row min-h-[600px]">
//             {/* Left Section */}
//             <div className="lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r border-slate-700/50">
//               <div className="flex items-center mb-6">
//                 <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg mr-3">
//                   <Code2 className="w-5 h-5 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-white">Your Code</h2>
//               </div>

//               <div className="relative group">
//                 <textarea
//                   className="w-full h-80 p-4 bg-slate-900/80 border border-slate-600/50 rounded-xl font-mono text-sm text-slate-200 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 group-hover:border-slate-500/50"
//                   placeholder={`// Paste your code here...
// function example() {
//   console.log('Hello, world!');
// }`}
//                   value={code}
//                   onChange={(e) => setCode(e.target.value)}
//                 />
//                 <div className="absolute top-3 right-3 text-xs text-slate-500 bg-slate-800/80 px-2 py-1 rounded">
//                   {code.split("\n").length} lines
//                 </div>
//               </div>

//               <button
//                 onClick={handleReview}
//                 disabled={loading || !code.trim()}
//                 className="group mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/25"
//               >
//                 <div className="flex items-center justify-center">
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                       Analyzing Code...
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
//                       Get AI Review
//                     </>
//                   )}
//                 </div>
//               </button>
//             </div>

//             {/* Right Section */}
//             <div className="lg:w-1/2 p-8 flex flex-col">
//               <div className="flex items-center mb-6">
//                 <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg mr-3">
//                   {review && !loading ? (
//                     <CheckCircle className="w-5 h-5 text-white" />
//                   ) : (
//                     <AlertCircle className="w-5 h-5 text-white" />
//                   )}
//                 </div>
//                 <h2 className="text-2xl font-semibold text-white">
//                   AI Analysis
//                 </h2>
//               </div>

//               <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-600/50 overflow-hidden flex flex-col">
//                 {loading ? (
//                   <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6">
//                     <div className="relative mb-4">
//                       <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
//                       <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-500 rounded-full animate-spin animation-delay-150"></div>
//                     </div>
//                     <p className="text-lg font-medium">
//                       Analyzing your code...
//                     </p>
//                     <p className="text-sm opacity-75 mt-2">
//                       This may take a few moments
//                     </p>
//                   </div>
//                 ) : review ? (
//                   <div className="flex-1 overflow-hidden flex flex-col">
//                     <div className="bg-slate-800/60 border-b border-slate-600/50 p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center">
//                           <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
//                           <span className="text-sm font-medium text-slate-300">
//                             Review Complete
//                           </span>
//                         </div>
//                         <div className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
//                           AI Generated
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex-1 overflow-y-auto p-6">
//                       <div className="prose prose-invert prose-purple max-w-none">
//                         <ReactMarkdown
//                           remarkPlugins={[remarkGfm]}
//                           components={{
//                             code({ inline, className, children, ...props }) {
//                               const match = /language-(\w+)/.exec(
//                                 className || ""
//                               );
//                               return !inline && match ? (
//                                 <div className="rounded-lg overflow-hidden border border-slate-600/50 my-4 bg-slate-800/50">
//                                   <div className="bg-slate-700/50 px-3 py-2 border-b border-slate-600/50">
//                                     <span className="text-xs text-slate-400 font-mono uppercase tracking-wide">
//                                       {match[1]}
//                                     </span>
//                                   </div>
//                                   <SyntaxHighlighter
//                                     language={match[1]}
//                                     style={oneDark}
//                                     PreTag="div"
//                                     customStyle={{
//                                       margin: 0,
//                                       borderRadius: 0,
//                                       background: "rgba(15, 23, 42, 0.6)",
//                                       fontSize: "13px",
//                                       lineHeight: "1.5",
//                                     }}
//                                     {...props}
//                                   >
//                                     {String(children).replace(/\n$/, "")}
//                                   </SyntaxHighlighter>
//                                 </div>
//                               ) : (
//                                 <code
//                                   className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30 text-sm"
//                                   {...props}
//                                 >
//                                   {children}
//                                 </code>
//                               );
//                             },
//                           }}
//                         >
//                           {review}
//                         </ReactMarkdown>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6">
//                     <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-600/30 text-center max-w-md">
//                       <Sparkles className="w-12 h-12 mx-auto mb-4 text-slate-500" />
//                       <h3 className="text-lg font-medium text-slate-300 mb-2">
//                         Ready for Analysis
//                       </h3>
//                       <p className="text-sm text-slate-400">
//                         Paste your code and click "Get AI Review" to receive
//                         intelligent feedback and suggestions.
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="relative z-10 max-w-7xl mx-auto mt-8 text-center">
//         <p className="text-slate-400 text-sm">
//           Powered by AI • Get instant code reviews and improvements
//         </p>
//       </div>
//     </div>
//   );
// }

// export default App;
