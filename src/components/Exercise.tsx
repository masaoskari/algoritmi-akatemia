"use client";
import React, { useEffect, useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { checkAnswer } from "@/lib/exerciseUtils";
import { User } from "@supabase/supabase-js";
import {
  isExerciseCompleted,
  markExerciseAsCompleted,
} from "@/actions/exerciseActions";
import { createClient } from "@/utils/supabase/client";
import LoadingExercise from "./LoadingExercise";

type ExcerciseProps = {
  editorHeight?: number;
  name: string;
  children: React.ReactNode;
  points: number;
  answer: string;
  level: number;
  input?: string[];
};

export const Excercise = ({
  editorHeight = 200,
  name,
  children,
  points,
  answer,
  level,
  input,
}: ExcerciseProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const supabase = createClient();

  const handleCodeExecutionOutput = (output: string) => {
    setIsCompleted(checkAnswer(output, answer));
    markExerciseAsCompleted(name, points);
  };

  useEffect(() => {
    const initExercise = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const completed = await isExerciseCompleted(name);
          setIsCompleted(completed);
        }
      } catch (error) {
        console.error("Error initializing exercise:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initExercise();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [name]);

  return isLoading ? (
    <LoadingExercise />
  ) : (
    <>
      <h2 className="mt-4">Harjoitus</h2>
      <div className="rounded shadow-lg">
        <div
          className={`flex flex-col rounded-tl-md rounded-tr-md ${
            isCompleted && user
              ? "bg-green-600"
              : !user
              ? "bg-amber-700"
              : "bg-blue-600"
          }`}
        >
          {!user && (
            <p className="text-white m-0 mt-4 text-center">
              🔒 Kirjaudu sisään kerätäksesi pisteitä tästä tehtävästä
            </p>
          )}
          <div className={"flex justify-between items-center p-4"}>
            <p className="text-white font-bold">
              {"⭐".repeat(level)} {name}
            </p>
            <p className="text-white font-bold">{`Pisteet: ${
              isCompleted ? points : "0"
            } / ${points}`}</p>
          </div>
        </div>
        <div className="p-4">{children}</div>
        <p className="p-4">
          Kirjoita ohjelmasi alle ja tarkista se "Suorita" painikkeella:
        </p>
        <CodeEditor
          height={editorHeight}
          answer={answer}
          input={input}
          onCodeExecution={handleCodeExecutionOutput}
        />
      </div>
    </>
  );
};
