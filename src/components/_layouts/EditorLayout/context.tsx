"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

export type EditorSaveStatus = "idle" | "saving" | "saved" | "error";

export interface EditorStudioActions {
    saveDraft?: () => void | Promise<void>;
    publish?: () => void | Promise<void>;
    retrySave?: () => void | Promise<void>;
}

export interface EditorStudioContextValue {
    saveStatus: EditorSaveStatus;
    setSaveStatus: (status: EditorSaveStatus) => void;
    articleStatus: "draft" | "published";
    setArticleStatus: (status: "draft" | "published") => void;
    registerActions: (actions: EditorStudioActions) => () => void;
    saveDraft: () => void;
    publish: () => void;
    retrySave: () => void;
}

export const EditorStudioContext = createContext<EditorStudioContextValue | null>(
    null
);

export function EditorStudioProvider({ children }: { children: ReactNode }) {
    const [saveStatus, setSaveStatus] = useState<EditorSaveStatus>("idle");
    const [articleStatus, setArticleStatus] = useState<"draft" | "published">("draft");
    const actionsRef = useRef<EditorStudioActions>({});

    const registerActions = useCallback((actions: EditorStudioActions) => {
        actionsRef.current = actions;
        return () => {
            if (actionsRef.current === actions) {
                actionsRef.current = {};
            }
        };
    }, []);

    const saveDraft = useCallback(() => {
        void actionsRef.current.saveDraft?.();
    }, []);

    const publish = useCallback(() => {
        void actionsRef.current.publish?.();
    }, []);

    const retrySave = useCallback(() => {
        if (actionsRef.current.retrySave) {
            void actionsRef.current.retrySave();
        } else {
            void actionsRef.current.saveDraft?.();
        }
    }, []);

    const value = useMemo<EditorStudioContextValue>(
        () => ({
            saveStatus,
            setSaveStatus,
            articleStatus,
            setArticleStatus,
            registerActions,
            saveDraft,
            publish,
            retrySave,
        }),
        [saveStatus, articleStatus, registerActions, saveDraft, publish, retrySave]
    );

    return (
        <EditorStudioContext.Provider value={value}>
            {children}
        </EditorStudioContext.Provider>
    );
}

export function useEditorStudio(): EditorStudioContextValue {
    const context = useContext(EditorStudioContext);
    if (!context) {
        throw new Error(
            "useEditorStudio harus digunakan di dalam EditorLayout / EditorStudioProvider"
        );
    }
    return context;
}
