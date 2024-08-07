"use client";
import React, { useState } from "react";
import { CodeEditor } from "./CodeEditor";

type ExcerciseProps = {
  editorHeight?: number;
  name: string;
  children: React.ReactNode;
  points: number;
  answer: string;
};

export const Excercise = ({
  editorHeight = 200,
  name,
  children,
  points,
  answer,
}: ExcerciseProps) => {
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleCodeExecutionOutput = (output: string) => {
    setIsCorrect(output.trim() === answer.trim());
  };

  return (
    <>
      <h2 className="mt-4">Harjoitus</h2>
      <div className="rounded shadow-lg">
        <div className="rounded-tl-md rounded-tr-md bg-blue-600 flex justify-between items-center p-4">
          <p className="text-white font-bold">{name}</p>
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
          onCodeExecution={handleCodeExecutionOutput}
        />
      </div>
    </>
  );
};
