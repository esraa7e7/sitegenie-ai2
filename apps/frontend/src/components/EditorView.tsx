import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import { SandpackProvider, SandpackFile, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";
import { Save, Sparkles, Loader2, Play } from "lucide-react";
import { aiApi, projectApi } from "../lib/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditorViewProps {
  // projectId?: string;
}

interface Project {
  id: string;
  name: string;
  code: string;
}

export const EditorView: React.FC<EditorViewProps> = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const queryClient = useQueryClient();
  const [code, setCode] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("New Project");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [sandpackFiles, setSandpackFiles] = useState<Record<string, SandpackFile>>({});

  const { data: projectData, isLoading: isLoadingProject } = useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: () => projectApi.get(projectId!),
    enabled: !!projectId,
    meta: { errorMessage: "Failed to load project." }
  });

  useEffect(() => {
    if (projectData) {
      setCurrentProject(projectData);
      setCode(projectData.code);
      setProjectName(projectData.name);
      setSandpackFiles({
        "/App.js": {
          code: projectData.code,
          active: true,
        },
        "/index.js": {
          code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
          hidden: true,
        },
        "/package.json": {
          code: JSON.stringify({
            name: "react",
            version: "1.0.0",
            description: "",
            main: "/index.js",
            dependencies: {
              react: "18.0.0",
              "react-dom": "18.0.0",
              "react-scripts": "5.0.0",
            },
            keywords: [],
          }, null, 2),
          hidden: true,
        },
      });
    } else if (!projectId) {
      // For a new project, initialize with a basic template
      const initialCode = `import React from \"react\";\n
function App() {\n  return (\n    <div style={{ padding: \"20px\", fontFamily: \"sans-serif\" }}>\n      <h1>Welcome to SiteGenie AI!</h1>\n      <p>Start building your website here.</p>\n    </div>\n  );
}\n
export default App;\n`;
      setCode(initialCode);
      setProjectName("New Project");
      setSandpackFiles({
        "/App.js": {
          code: initialCode,
          active: true,
        },
        "/index.js": {
          code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
          hidden: true,
        },
        "/package.json": {
          code: JSON.stringify({
            name: "react",
            version: "1.0.0",
            description: "",
            main: "/index.js",
            dependencies: {
              react: "18.0.0",
              "react-dom": "18.0.0",
              "react-scripts": "5.0.0",
            },
            keywords: [],
          }, null, 2),
          hidden: true,
        },
      });
    }
  }, [projectData, projectId]);

  const saveProjectMutation = useMutation({
    mutationFn: (data: { id?: string; name: string; code: string }) => {
      if (data.id) {
        return projectApi.update(data.id, { name: data.name, code: data.code });
      } else {
        return projectApi.create({ name: data.name, description: "AI Generated Project", code: data.code });
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (!projectId) {
        navigate(`/editor/${data.id}`); // Navigate to the new project URL
      }
      toast.success("Project saved successfully!");
      setCurrentProject(data);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save project.");
    },
  });

  const generateCodeMutation = useMutation({
    mutationFn: (prompt: string) => aiApi.generate(currentProject?.id || "", prompt),
    onSuccess: (data) => {
      setCode(data.code);
      setSandpackFiles((prev) => ({
        ...prev,
        "/App.js": { ...prev["/App.js"], code: data.code },
      }));
      toast.success("AI generated code successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to generate code with AI.");
    },
  });

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
    setSandpackFiles((prev) => ({
      ...prev,
      "/App.js": { ...prev["/App.js"], code: value || "" },
    }));
  };

  const handleSave = () => {
    saveProjectMutation.mutate({ id: currentProject?.id, name: projectName, code });
  };

  const handleGenerateCode = () => {
    const aiPrompt = prompt("Enter your AI prompt:"); // Renamed prompt to aiPrompt
    if (aiPrompt) {
      generateCodeMutation.mutate(aiPrompt);
    }
  };

  if (isLoadingProject) return <div>Loading project...</div>;

  return (
    <div className="flex flex-col h-screen bg-slate-950">
      <header className="flex items-center justify-between p-4 bg-slate-900 shadow-md">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent text-white text-xl font-bold focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleGenerateCode}
            disabled={generateCodeMutation.isPending}
            className="px-4 py-2 bg-indigo-600 rounded-md text-white flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
          >
            {generateCodeMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate with AI
          </button>
          <button
            onClick={handleSave}
            disabled={saveProjectMutation.isPending}
            className="px-4 py-2 bg-green-600 rounded-md text-white flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
          >
            {saveProjectMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Project
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-1/2 bg-slate-800">
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
          />
        </div>
        <div className="w-1/2 bg-white">
          {sandpackFiles["/App.js"] && (
            <SandpackProvider template="react" files={sandpackFiles}>
              <SandpackLayout>
                <SandpackCodeEditor showLineNumbers={true} showTabs={true} />
                <SandpackPreview showRefreshButton={true} />
              </SandpackLayout>
            </SandpackProvider>
          )}
        </div>
      </div>
    </div>
  );
};
