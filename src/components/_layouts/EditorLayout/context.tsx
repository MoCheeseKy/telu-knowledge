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
import type {
    EditorSaveStatus,
    EditorStudioActions,
    EditorStudioContextValue,
} from "./editor-layout.types";

export type {
    EditorSaveStatus,
    EditorStudioActions,
    EditorStudioContextValue,
};

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

    const unpublish = useCallback(() => {
        void actionsRef.current.unpublish?.();
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
            unpublish,
            retrySave,
        }),
        [saveStatus, articleStatus, registerActions, saveDraft, publish, unpublish, retrySave]
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
