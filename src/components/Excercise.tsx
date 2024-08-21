"use client";
import React, { useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { checkAnswer } from "@/lib/exerciseUtils";

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
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleCodeExecutionOutput = (output: string) => {
    setIsCorrect(checkAnswer(output, answer));
  };

  return (
    <>
      <h2 className="mt-4">Harjoitus</h2>
      <div className="rounded shadow-lg">
        <div className="rounded-tl-md rounded-tr-md bg-blue-600 flex justify-between items-center p-4">
          <p className="text-white font-bold">
            {"⭐".repeat(level)} {name}
          </p>
          {/* TODO: Points needs to be store and get from server side. */}
          <p className="text-white font-bold">{`Pisteet: ${
            isCorrect ? points : "0"
          } / ${points}`}</p>
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
